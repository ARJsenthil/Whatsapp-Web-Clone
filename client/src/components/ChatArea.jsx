// client/src/components/ChatArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Input, Button } from 'antd';
import { SearchOutlined, PaperClipOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';
import Message from './Message';
import '../styles/ChatArea.css';
const ChatArea = ({ selectedConversation, messages, onSendMessage, currentUser }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };
  if (!selectedConversation) {
    return (
      <div className="chat-area empty">
        <div className="empty-state">
          <Avatar size={200} src="https://via.placeholder.com/200" />
          <h1>WhatsApp Web</h1>
          <p>Send and receive messages without keeping your phone online.</p>
          <p>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="chat-area">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-info">
          <Avatar size={40} src="https://via.placeholder.com/40" />
          <div className="chat-details">
            <h3>{selectedConversation.user_name}</h3>
            <p>Online</p>
          </div>
        </div>
        <div className="chat-actions">
          <SearchOutlined />
        </div>
      </div>
      {/* Messages */}
      <div className="messages-container">
        {messages.map(message => (
          <Message 
            key={message._id} 
            message={message} 
            isOutgoing={message.from === currentUser} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Area */}
      <div className="input-area">
        <Button type="text" icon={<PaperClipOutlined />} />
        <Input 
          className="message-input"
          placeholder="Type a message"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button 
          type="text" 
          icon={messageInput ? <SendOutlined /> : <SmileOutlined />} 
          onClick={handleSend}
        />
      </div>
    </div>
  );
};
export default ChatArea;