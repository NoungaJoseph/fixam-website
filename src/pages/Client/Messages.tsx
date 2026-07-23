import './Messages.css';
import React, { useState, useEffect, useRef } from 'react';
import { images, getMediaUrl } from '../../App';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
  const [newMsgText, setNewMsgText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!c) return { name: 'Support', avatar: images.proJeff, other: null };
    const other = c.participants?.find((p: any) => p.id !== user?.id) || c.participants?.[0];
    const name = other?.fullName || 
      (other?.firstName ? `${other.firstName} ${other.lastName || ''}`.trim() : '') || 
      (c.isSystem ? 'Fixam Support' : 'User');
    const avatar = other?.avatar ? getMediaUrl(other.avatar) : images.proJeff;
    return { other, name, avatar };
  };

  const activeConv = conversations.find(c => {
    if (c.id === activeChatUser) return true;
    const { name, other } = getParticipantDetails(c);
    return name === activeChatUser || other?.id === activeChatUser;
  });

  const activeDetails = activeConv ? getParticipantDetails(activeConv) : { name: activeChatUser || 'Chat', avatar: images.proJeff, other: null };

  useEffect(() => {
    if (activeConv) {
      api.get(`/chat/${activeConv.id}/messages`).then(res => {
        setMessages(res.data.data || []);
      }).catch(console.error);

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

  const handleSendMsg = async (e?: React.FormEvent, customContent?: string, customType: string = 'TEXT', mediaUrl?: string) => {
    if (e) e.preventDefault();
    const contentToSend = customContent || newMsgText;
    if ((!contentToSend.trim() && !mediaUrl && selectedImages.length === 0) || !activeConv) return;
    
    setNewMsgText('');
    
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
          console.error("Failed to send image", err);
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
        console.error("Failed to send msg", err);
      }
    }
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

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      alert('🎤 Recording voice note... Click again to send.');
    } else {
      setIsRecording(false);
      handleSendMsg(undefined, '🎤 Voice note (0:15)', 'AUDIO');
    }
  };

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
                    <div style={{ height: '180px', background: '#E2E8F0', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundSize: 'cover', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundColor: '#f1f5f9' }}>
                      <span style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🗺️</span>
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Tracking Live Location in Real-time</span>
                      <a 
                        href="https://maps.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ marginTop: '8px', color: '#0D9488', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'underline' }}
                      >
                        Open Full Live Map ↗
                      </a>
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
              {messages.map((msg) => {
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                          🎵 <span>{msg.content}</span>
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
              })}
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

            <div className="chat-input-area" style={{ flexDirection: 'row', alignItems: 'flex-end', padding: '10px 15px', background: '#f0f2f5', gap: '8px' }}>
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

              {newMsgText.trim() || selectedImages.length > 0 ? (
                <button type="button" onClick={(e) => handleSendMsg(e)} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#00a884', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                  ➤
                </button>
              ) : (
                <button type="button" title="Send Voice Note" onClick={handleVoiceRecord} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#00a884', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
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

