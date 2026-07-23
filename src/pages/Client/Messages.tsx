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
  }) || (conversations.length > 0 ? conversations[0] : null);

  const activeDetails = activeConv ? getParticipantDetails(activeConv) : { name: activeChatUser || 'Chat', avatar: images.proJeff, other: null };

  useEffect(() => {
    if (activeConv) {
      api.get(`/chat/${activeConv.id}/messages`).then(res => {
        setMessages(res.data.data || []);
      }).catch(console.error);
    } else {
      setMessages([]);
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
            </div>

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
                      <span className="bubble-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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

            <div className="chat-input-area">
              <input 
                type="file" 
                ref={fileInputRef} 
                multiple 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImagePick} 
              />
              <div className="chat-input-actions">
                <button 
                  type="button"
                  className="chat-action-btn" 
                  title="Attach Images" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  🖼️
                </button>
                <button 
                  type="button"
                  className="chat-action-btn" 
                  title="Send Voice Note" 
                  onClick={handleVoiceRecord}
                  style={isRecording ? { background: '#ef4444', color: '#fff' } : {}}
                >
                  🎤
                </button>
                <button 
                  type="button"
                  className="chat-action-btn" 
                  title="Share Physical Location" 
                  onClick={handleLocationShare}
                >
                  📍
                </button>
              </div>
              <form onSubmit={handleSendMsg} className="chat-input-bar">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
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

