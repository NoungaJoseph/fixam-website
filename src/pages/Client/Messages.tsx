import './Messages.css';
import React, { useState } from 'react';
import { images } from '../../App';

interface MessagesProps {
  chatMessages: any[];
  setChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  activeChatUser: string;
  setActiveChatUser: (user: string) => void;
}

export default function Messages({ chatMessages, setChatMessages, activeChatUser, setActiveChatUser }: MessagesProps) {
  const [newMsgText, setNewMsgText] = useState('');

  const chatUsers = [
    { name: 'Jeff Thomson', role: 'Plumbing Specialist', active: activeChatUser === 'Jeff Thomson', unread: 0, image: images.proJeff },
    { name: 'Samuel Bright', role: 'Electrician', active: activeChatUser === 'Samuel Bright', unread: 1, image: images.proSamuel },
    { name: 'Mary Clean', role: 'Cleaning Expert', active: activeChatUser === 'Mary Clean', unread: 0, image: images.proMary }
  ];

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    const newM = {
      id: Date.now(),
      sender: 'client',
      text: newMsgText,
      time: 'Just now'
    };
    setChatMessages([...chatMessages, newM]);
    setNewMsgText('');
    
    // Auto-reply simulation
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: 'pro',
        text: `Thanks for the message! I will get back to you shortly regarding the job request.`,
        time: 'Just now'
      };
      setChatMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="messages-grid-layout animate-fade-in">
      <div className="dash-panel-premium chat-sidebar-panel">
        <h2>Inbox Chats</h2>
        <div className="chats-users-list">
          {chatUsers.map((cu, idx) => (
            <button 
              className={`chat-user-row ${cu.name === activeChatUser ? 'active' : ''}`}
              key={idx}
              onClick={() => setActiveChatUser(cu.name)}
            >
              <img src={cu.image} alt={cu.name} />
              <div className="chat-user-info">
                <h4>{cu.name}</h4>
                <span>{cu.role}</span>
              </div>
              {cu.unread > 0 && <span className="chat-unread-dot">{cu.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-panel-premium chat-viewport-panel">
        <div className="chat-header-row">
          <img src={chatUsers.find(u => u.name === activeChatUser)?.image || images.proJeff} alt={activeChatUser} />
          <div>
            <h3>{activeChatUser}</h3>
            <span className="online-badge">• Online</span>
          </div>
        </div>

        <div className="chat-messages-scroll">
          {chatMessages.map((msg) => (
            <div className={`msg-bubble-row ${msg.sender}`} key={msg.id}>
              <div className="bubble-content">
                <p>{msg.text}</p>
                <span className="bubble-time">{msg.time}</span>
              </div>
            </div>
          ))}
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
    </div>
  );
}
