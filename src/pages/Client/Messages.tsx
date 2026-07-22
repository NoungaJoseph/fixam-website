import './Messages.css';
import React, { useState, useEffect, useRef } from 'react';
import { images, getMediaUrl, Icon } from '../../App';
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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const activeConv = conversations.find(c => {
    const other = c.participants?.find((p: any) => p.id !== user?.id);
    const fullName = other ? `${other.firstName || ''} ${other.lastName || ''}`.trim() : 'Support';
    return fullName === activeChatUser || c.id === activeChatUser; // fallback if activeChatUser is ID
  });

  useEffect(() => {
    if (activeConv) {
      api.get(`/chat/${activeConv.id}/messages`).then(res => {
        setMessages(res.data.data || []);
      }).catch(console.error);
    } else {
      setMessages([]);
    }
  }, [activeConv]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || !activeConv) return;
    
    const text = newMsgText;
    setNewMsgText('');
    
    // Optimistic UI
    const tempMsg = {
      id: Date.now().toString(),
      content: text,
      senderId: user?.id,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await api.post('/chat/send', {
        conversationId: activeConv.id,
        content: text,
        type: 'TEXT'
      });
      // reload messages
      const res = await api.get(`/chat/${activeConv.id}/messages`);
      setMessages(res.data.data || []);
    } catch (err) {
      console.error("Failed to send", err);
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
          {conversations.map((c) => {
            const other = c.participants?.find((p: any) => p.id !== user?.id);
            const fullName = other ? `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'Unknown' : 'Support';
            const isActive = activeConv?.id === c.id;
            return (
              <button 
                className={`chat-user-row ${isActive ? 'active' : ''}`}
                key={c.id}
                onClick={() => setActiveChatUser(fullName)}
              >
                <img src={other?.avatar ? getMediaUrl(other.avatar) : images.proJeff} alt={fullName} />
                <div className="chat-user-info">
                  <h4>{fullName}</h4>
                  <span>{c.isSystem ? 'System Chat' : 'User'}</span>
                </div>
                {c.unreadCount > 0 && <span className="chat-unread-dot">{c.unreadCount}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="chat-viewport-native">
        {activeConv ? (
          <>
            <div className="chat-header-row">
              <button className="mobile-back-btn" onClick={() => setActiveChatUser('')}>
                ←
              </button>
              <img src={images.proJeff} alt={activeChatUser} />
              <div>
                <h3>{activeChatUser}</h3>
                <span className="online-badge">• Active</span>
              </div>
            </div>

            <div className="chat-messages-scroll" ref={scrollRef}>
              {messages.map((msg) => (
                <div className={`msg-bubble-row ${msg.senderId === user?.id ? 'client' : 'pro'}`} key={msg.id}>
                  <div className="bubble-content">
                    <p>{msg.content}</p>
                    <span className="bubble-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <div className="chat-input-actions">
                <button className="chat-action-btn" title="Attach Images" onClick={() => alert('Attach multiple images UI placeholder')}>
                  <Icon name="check" /> {/* Placeholder icon */}
                  📎
                </button>
                <button className="chat-action-btn" title="Send Voice Note" onClick={() => alert('Send Voice Note UI placeholder')}>
                  🎤
                </button>
                <button className="chat-action-btn" title="Track Location" onClick={() => alert('Track Location UI placeholder')}>
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
