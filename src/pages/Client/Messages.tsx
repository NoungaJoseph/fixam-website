import './Messages.css';
import React, { useState, useEffect, useRef } from 'react';
import { images, getMediaUrl, DEFAULT_AVATAR } from '../../App';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ─── External Contact Detection ──────────────────────────────────────────────
// Matches phone numbers (Cameroon +237 and local formats), WhatsApp/Telegram
// links, email addresses, and common off-platform phrases (EN + FR).
const EXTERNAL_CONTACT_PATTERNS: RegExp[] = [
  // Cameroon numbers: +237 or 00237 followed by a 6/7/9 digit number
  /(?:\+237|00237)[\s\-.]?[679]\d{7,8}/,
  /\b[679]\d{7}\b/,
  // Generic international numbers  (+XX ...)
  /\+\d{1,3}[\s\-.][\d\s\-.]{7,}/,
  // WhatsApp / Telegram links
  /wa\.me\//i,
  /t\.me\//i,
  /whatsapp\.com/i,
  // Email addresses
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
  // Common off-platform phrases (English & French)
  /\b(call me|whatsapp me|text me|dm me|reach me|contact me|here(?:'s| is) my number|mon num[eé]ro|appelle.?moi|écris.?moi sur|rejoins.?moi sur)\b/i,
];

/** Returns the first matching excerpt, or null if no pattern matches. */
const detectExternalContact = (text: string): string | null => {
  for (const pattern of EXTERNAL_CONTACT_PATTERNS) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
};

// Disclosure copy (EN / FR based on browser/app language)
const DISCLOSURE_EN = 'Messages in this chat may be reviewed by Fixam support in case of a dispute.';
const DISCLOSURE_FR = 'Les messages de cette conversation peuvent être examinés par le support Fixam en cas de litige.';
const WARNING_TITLE_EN = 'Keep your conversation safe';
const WARNING_BODY_EN = "Moving this conversation outside Fixam means we can't help resolve disputes if something goes wrong.";
const WARNING_TITLE_FR = 'Protégez votre conversation';
const WARNING_BODY_FR = "Déplacer cette conversation hors de Fixam nous empêche de résoudre tout litige si quelque chose ne va pas.";

interface MessagesProps {
  chatMessages: any[];
  setChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  activeChatUser: string;
  setActiveChatUser: (user: string) => void;
}

export default function Messages({ activeChatUser, setActiveChatUser }: MessagesProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [newMsgText, setNewMsgText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recordDuration, setRecordDuration] = useState(0);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerIdRef = useRef<any>(null);
  const isRecordingCancelledRef = useRef(false);

  // Feature 2: tracks whether we are waiting for the user's answer on the
  // external-contact-sharing confirmation dialog.
  const [contactWarning, setContactWarning] = useState<{
    detectedPattern: string;
    pendingContent: string;
    pendingType: string;
    pendingMediaUrl?: string;
  } | null>(null);

  // Detect browser/app language for bilingual copy
  const isFr = typeof navigator !== 'undefined' && navigator.language.startsWith('fr');

  useEffect(() => {
    const loadConvs = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data.data || []);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
    loadConvs();
    
    // Poll for new messages every 5s if active
    const interval = setInterval(loadConvs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getParticipantDetails = (c: any) => {
    if (!c) return { name: 'Support', avatar: DEFAULT_AVATAR, other: null };
    const other = c.participants?.find((p: any) => p.id !== user?.id) || c.participants?.[0];
    const name = other?.fullName || 
      (other?.firstName ? `${other.firstName} ${other.lastName || ''}`.trim() : '') || 
      (c.isSystem ? 'Fixam Support' : 'User');
    const avatar = other?.avatar ? getMediaUrl(other.avatar) : DEFAULT_AVATAR;
    return { other, name, avatar };
  };

  const activeConv = conversations.find(c => {
    if (c.id === activeChatUser) return true;
    const { name, other } = getParticipantDetails(c);
    return name === activeChatUser || other?.id === activeChatUser;
  });

  const activeDetails = activeConv ? getParticipantDetails(activeConv) : { name: activeChatUser || 'Chat', avatar: DEFAULT_AVATAR, other: null };

  useEffect(() => {
    if (activeConv) {
      setIsLoadingMessages(true);
      api.get(`/chat/${activeConv.id}/messages`).then(res => {
        setMessages(res.data.data || []);
        setIsLoadingMessages(false);
      }).catch(err => {
        console.error(err);
        setIsLoadingMessages(false);
      });

      api.get(`/chat/${activeConv.id}/active-task`).then(res => {
        setActiveTask(res.data?.data || null);
      }).catch(() => setActiveTask(null));
    } else {
      setMessages([]);
      setActiveTask(null);
    }
  }, [activeConv?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Core send dispatcher — called only after all safety checks have passed.
   * Do not invoke directly for TEXT messages; use handleSendMsg() instead.
   */
  const _dispatchSendMsg = async (contentToSend: string, customType: string, mediaUrl?: string) => {
    if (!activeConv) return;

    // Send images if attached
    if (selectedImages.length > 0) {
      const imagesToSend = [...selectedImages];
      setSelectedImages([]);
      for (const imgUrl of imagesToSend) {
        const tempMsg = {
          id: Date.now().toString() + Math.random(),
          content: 'Sent an image',
          mediaUrl: imgUrl,
          type: 'IMAGE',
          senderId: user?.id,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        try {
          await api.post('/chat/send', {
            conversationId: activeConv.id,
            content: 'Sent an image',
            mediaUrl: imgUrl,
            type: 'IMAGE'
          });
        } catch (err) {
          console.error('Failed to send image', err);
        }
      }
    }

    if (contentToSend.trim() || mediaUrl) {
      const tempMsg = {
        id: Date.now().toString(),
        content: contentToSend,
        mediaUrl: mediaUrl || null,
        type: customType,
        senderId: user?.id,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);

      try {
        await api.post('/chat/send', {
          conversationId: activeConv.id,
          content: contentToSend,
          mediaUrl: mediaUrl || null,
          type: customType
        });
        const res = await api.get(`/chat/${activeConv.id}/messages`);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error('Failed to send msg', err);
      }
    }
  };

  /**
   * Main send handler.
   * For TEXT messages, scans for external-contact patterns before sending.
   * If found, surfaces an inline confirmation dialog instead of sending immediately.
   */
  const handleSendMsg = async (e?: React.FormEvent, customContent?: string, customType: string = 'TEXT', mediaUrl?: string) => {
    if (e) e.preventDefault();
    const contentToSend = customContent || newMsgText;
    if ((!contentToSend.trim() && !mediaUrl && selectedImages.length === 0) || !activeConv) return;

    // ── Feature 2: External contact detection (TEXT only) ─────────────────────
    if (customType === 'TEXT' && contentToSend.trim()) {
      const detectedPattern = detectExternalContact(contentToSend);
      if (detectedPattern) {
        // Log warning event immediately (fire-and-forget)
        api.post(`/chat/${activeConv.id}/log-contact-warning`, {
          detectedPattern,
          sentAnyway: false,
          platform: 'web',
        }).catch(() => {});

        // Surface the inline confirmation dialog — do NOT send yet
        setContactWarning({
          detectedPattern,
          pendingContent: contentToSend,
          pendingType: customType,
          pendingMediaUrl: mediaUrl,
        });
        return;
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    setNewMsgText('');
    await _dispatchSendMsg(contentToSend, customType, mediaUrl);
  };

  /** Called when the user clicks "Send Anyway" in the contact-warning dialog. */
  const handleSendAnyway = async () => {
    if (!contactWarning || !activeConv) return;
    // Log that the user chose to send
    api.post(`/chat/${activeConv.id}/log-contact-warning`, {
      detectedPattern: contactWarning.detectedPattern,
      sentAnyway: true,
      platform: 'web',
    }).catch(() => {});
    const { pendingContent, pendingType, pendingMediaUrl } = contactWarning;
    setContactWarning(null);
    setNewMsgText('');
    await _dispatchSendMsg(pendingContent, pendingType, pendingMediaUrl);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationText = `📍 My Physical Location: https://maps.google.com/?q=${latitude},${longitude}`;
          handleSendMsg(undefined, locationText, 'LOCATION');
        },
        () => {
          alert('Unable to retrieve your location. Please check browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const formatRecordTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioChunksRef.current.length > 0 && !isRecordingCancelledRef.current) {
          setIsUploadingAudio(true);
          try {
            const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'generic');
            const uploadRes = await api.post('/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = uploadRes.data.url;
            await handleSendMsg(undefined, `🎤 Voice Note (${formatRecordTime(recordDuration)})`, 'AUDIO', url);
          } catch (err) {
            console.error("Failed to upload audio message", err);
            alert("Failed to send voice note.");
          } finally {
            setIsUploadingAudio(false);
          }
        }
        stream.getTracks().forEach(track => track.stop());
      };

      isRecordingCancelledRef.current = false;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);
      
      if (recordTimerIdRef.current) clearInterval(recordTimerIdRef.current);
      recordTimerIdRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Audio recording failed to start", err);
      alert("Could not access microphone.");
    }
  };

  const stopAudioRecording = (shouldCancel = false) => {
    if (recordTimerIdRef.current) {
      clearInterval(recordTimerIdRef.current);
      recordTimerIdRef.current = null;
    }
    isRecordingCancelledRef.current = shouldCancel;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      startAudioRecording();
    } else {
      stopAudioRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recordTimerIdRef.current) {
        clearInterval(recordTimerIdRef.current);
      }
    };
  }, []);

  const isMobileDetailView = activeConv ? 'viewing-chat' : 'viewing-list';

  return (
    <div className={`messages-native-layout ${isMobileDetailView} animate-fade-in`}>
      <div className="chat-sidebar-native">
        <div className="chat-sidebar-header">
          <h2>Inbox Chats</h2>
        </div>
        <div className="chats-users-list">
          {conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
              No active conversations yet.
            </div>
          ) : (
            conversations.map((c) => {
              const { name, avatar } = getParticipantDetails(c);
              const isActive = activeConv?.id === c.id;
              return (
                <button 
                  className={`chat-user-row ${isActive ? 'active' : ''}`}
                  key={c.id}
                  onClick={() => setActiveChatUser(c.id)}
                >
                  <img src={avatar} alt={name} />
                  <div className="chat-user-info">
                    <h4>{name}</h4>
                    <span>{c.isSystem ? 'System Support' : (c.lastMessage?.content || 'Tap to chat')}</span>
                  </div>
                  {c.unreadCount > 0 && <span className="chat-unread-dot">{c.unreadCount}</span>}
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="chat-viewport-native">
        {activeConv ? (
          <>
            <div className="chat-header-row">
              <button className="mobile-back-btn" onClick={() => setActiveChatUser('')}>
                ←
              </button>
              <img src={activeDetails.avatar} alt={activeDetails.name} />
              <div>
                <h3>{activeDetails.name}</h3>
                <span className="online-badge">• Active</span>
              </div>

              {/* ── Feature 1: Chat Disclosure Notice ────────────────────────────
                  Persistent, non-dismissable info strip. Shown every time a
                  conversation is opened on both client and provider views. ── */}

            </div>

            {/* Disclosure banner — always visible, no interaction required */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
              fontSize: '11px',
              color: '#6B7280',
              lineHeight: '1.4',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>{isFr ? DISCLOSURE_FR : DISCLOSURE_EN}</span>
            </div>

            {/* ── Feature 2: External-contact-sharing inline warning dialog ───
                Shown in-place (not a modal) when a potential off-platform
                contact is detected before the message is sent. ────────── */}
            {contactWarning && (
              <div style={{
                margin: '8px 12px 0',
                background: '#FFFBEB',
                border: '1px solid #FCD34D',
                borderRadius: '10px',
                padding: '12px 14px',
              }}>
                <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '13px', color: '#92400E' }}>
                  ⚠️ {isFr ? WARNING_TITLE_FR : WARNING_TITLE_EN}
                </p>
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#78350F', lineHeight: '1.5' }}>
                  {isFr ? WARNING_BODY_FR : WARNING_BODY_EN}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setContactWarning(null)}
                    style={{
                      flex: 1, padding: '7px', border: '1px solid #D1D5DB',
                      borderRadius: '8px', background: '#fff', fontSize: '12px',
                      fontWeight: 600, cursor: 'pointer', color: '#374151',
                    }}
                  >
                    {isFr ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSendAnyway}
                    style={{
                      flex: 1, padding: '7px', border: 'none',
                      borderRadius: '8px', background: '#F59E0B', fontSize: '12px',
                      fontWeight: 700, cursor: 'pointer', color: '#fff',
                    }}
                  >
                    {isFr ? 'Envoyer quand même' : 'Send Anyway'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Tracking button (existing) ─────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 12px 0' }}>
              {!activeConv.isSystem && (
                <div style={{ marginLeft: 'auto' }}>
                  <button 
                    type="button"
                    onClick={() => setShowTrackingModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)'
                    }}
                  >
                    📍 Track Provider
                  </button>
                </div>
              )}
            </div>

            {/* Provider Tracking Overlay Modal */}
            {showTrackingModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  maxWidth: '520px',
                  width: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
                }}>
                  {/* Header */}
                  <div style={{ background: '#0F172A', color: '#fff', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>📍</span>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Live Provider Tracking</h3>
                    </div>
                    <button 
                      onClick={() => setShowTrackingModal(false)}
                      style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.5rem' }}>
                    {/* Live Status Badge */}
                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.8rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 4px rgba(34,197,94,0.2)' }}></span>
                        <span style={{ fontWeight: 700, color: '#166534', fontSize: '0.9rem' }}>
                          {activeTask?.status === 'IN_PROGRESS' ? 'Provider On Site' : 'Provider En Route'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#15803D', fontWeight: 600 }}>ETA: ~10 mins</span>
                    </div>

                    {/* Provider Info Card */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#F8FAFC', borderRadius: '12px', marginBottom: '1.2rem' }}>
                      <img src={activeDetails.avatar} alt={activeDetails.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', color: '#0F172A' }}>{activeDetails.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {activeTask?.title || activeTask?.category || 'Assigned Service Specialist'}
                        </span>
                      </div>
                      <a 
                        href={`tel:${activeDetails.other?.phone || ''}`} 
                        style={{ background: '#14B8A6', color: '#fff', padding: '8px 14px', borderRadius: '20px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        📞 Call
                      </a>
                    </div>

                    {/* Simulated Live Map Container */}
                    <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                      <iframe 
                        title="Live Provider Location"
                        width="100%" 
                        height="180" 
                        frameBorder="0" 
                        scrolling="no" 
                        src="https://maps.google.com/maps?width=100%25&amp;height=180&amp;hl=en&amp;q=4.0503,9.7679&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        style={{ border: 0 }}
                      />
                    </div>

                    {/* Progress Timeline */}
                    <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 10px' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#14B8A6', color: '#fff', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                        <span style={{ fontSize: '0.72rem', color: '#0F172A', fontWeight: 600 }}>Accepted</span>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#14B8A6', color: '#fff', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
                        <span style={{ fontSize: '0.72rem', color: '#0F172A', fontWeight: 600 }}>En Route</span>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#E2E8F0', color: '#64748B', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📍</div>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>On Site</span>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#E2E8F0', color: '#64748B', margin: '0 auto 4px auto', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏁</div>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Done</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="chat-messages-scroll" ref={scrollRef}>
              {isLoadingMessages ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', gap: '0.5rem' }}>
                  <div style={{ width: '24px', height: '24px', border: '2px solid #E2E8F0', borderTopColor: '#14B8A6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <span style={{ fontSize: '0.9rem' }}>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
                  <span style={{ fontSize: '0.9rem' }}>No messages here yet</span>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  const isLocation = msg.type === 'LOCATION' || msg.content?.includes('maps.google.com');
                  const isImage = msg.type === 'IMAGE' || msg.mediaUrl;
                  const isAudio = msg.type === 'AUDIO' || msg.content?.includes('Voice note');

                  return (
                    <div className={`msg-bubble-row ${isMe ? 'client' : 'pro'}`} key={msg.id}>
                      <div className="bubble-content">
                        {isImage && (
                          <img 
                            src={msg.mediaUrl} 
                            alt="Attachment" 
                            style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '0.4rem', display: 'block' }} 
                          />
                        )}
                        {isAudio && (
                          <div className="w-[240px] py-1">
                            <div className="flex items-center gap-2 mb-1.5 font-semibold text-xs opacity-90">
                              <span>🎤 Voice Note</span>
                            </div>
                            <audio 
                              src={msg.mediaUrl || msg.content} 
                              controls 
                              className="w-full h-8 outline-none rounded-lg text-teal-600"
                            />
                          </div>
                        )}
                        {isLocation ? (
                          <div>
                            <p>{msg.content}</p>
                            <a 
                              href={msg.content?.match(/https:\/\/maps\.google\.com[^\s]*/)?.[0] || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ color: isMe ? '#fff' : '#0284c7', textDecoration: 'underline', fontSize: '0.85rem', marginTop: '4px', display: 'inline-block' }}
                            >
                              🗺️ Open in Google Maps
                            </a>
                          </div>
                        ) : (
                          !isImage && !isAudio && <p>{msg.content}</p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                          <span className="bubble-time" style={{ margin: 0 }}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (
                            <span style={{ fontSize: '14px', color: msg.isRead || msg.readAt ? '#53bdeb' : (isMe && !msg.isRead ? '#8696a0' : '#8696a0'), lineHeight: 1 }}>
                              {msg.isRead || msg.readAt ? '✓✓' : (msg.deliveredAt ? '✓✓' : '✓')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Images Preview Bar */}
            {selectedImages.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', overflowX: 'auto' }}>
                {selectedImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={img} alt="Preview" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    <button 
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                      style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="chat-input-area" style={{ flexDirection: 'row', alignItems: 'center', padding: '10px 15px', background: '#f0f2f5', gap: '8px' }}>
              {isRecording ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '24px', padding: '10px 20px', minHeight: '44px', justifyContent: 'space-between' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-red-500 font-bold text-sm tracking-wider">
                      Recording voice note: {formatRecordTime(recordDuration)}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => stopAudioRecording(true)} 
                    className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    multiple 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleImagePick} 
                  />
                  
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '24px', padding: '5px 10px', minHeight: '44px' }}>
                    <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: 'none', color: '#8696a0', fontSize: '1.2rem', padding: '0 8px', cursor: 'pointer' }}>
                      📎
                    </button>
                    <input 
                      type="text" 
                      placeholder="Type a message" 
                      value={newMsgText}
                      onChange={(e) => setNewMsgText(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter') handleSendMsg(); }}
                      style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '1rem', padding: '8px', color: '#111b21' }}
                    />
                    <button type="button" title="Share Location" onClick={handleLocationShare} style={{ background: 'none', border: 'none', color: '#8696a0', fontSize: '1.2rem', padding: '0 8px', cursor: 'pointer' }}>
                      📍
                    </button>
                  </div>
                </>
              )}

              {isUploadingAudio ? (
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (newMsgText.trim() || selectedImages.length > 0) && !isRecording ? (
                <button type="button" onClick={(e) => handleSendMsg(e)} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#00a884', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                  ➤
                </button>
              ) : (
                <button type="button" title={isRecording ? "Stop & Send" : "Send Voice Note"} onClick={handleVoiceRecord} style={{ width: '48px', height: '48px', borderRadius: '50%', background: isRecording ? '#ef4444' : '#00a884', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                  {isRecording ? '⏹️' : '🎤'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-500)', background: '#f8fafc' }}>
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}

