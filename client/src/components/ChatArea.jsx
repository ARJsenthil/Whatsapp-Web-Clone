import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Input, Button, message as antMessage } from 'antd';
import { SearchOutlined, PaperClipOutlined, SmileOutlined, SendOutlined, ArrowLeftOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import Message from './Message';
import '../assets/styles/ChatArea.css';
import default_avatar from '../assets/images/default-avatar.png';
import whatsapp_logo from '../assets/images/whatsapp-logo.png';

const ChatArea = ({
  selectedConversation,
  messages,
  onSendMessage,
  currentUser,
  isMobile,
  onBackToChatList
}) => {

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (messageInput.trim()) {
      try {
        onSendMessage(messageInput);
        setMessageInput('');
      } catch (error) {
        antMessage.error('Failed to send message');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedConversation) {
    return (
      <div className="chat-area empty">
        <div className="empty-state">
          <Avatar size={200} src={whatsapp_logo} />
          <h1>WhatsApp Web</h1>
          <p>Send and receive messages without keeping your phone online.</p>
          <p>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-area ${isMobile ? 'mobile' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div className='back-btn'>
          {isMobile && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBackToChatList}
              className="back-button"
            />
          )}
          <div className="chat-info">
            <Avatar size={40} src={selectedConversation.avatar || default_avatar} />
            <div className="chat-details">
              <h3>{selectedConversation.user_name}</h3>
              <p>{isTyping ? 'typing...' : 'Online'}</p>
            </div>
          </div>
        </div>
        <div className="chat-actions">
          <SearchOutlined />
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <Message
              key={msg._id}
              message={msg}
              isOutgoing={msg.from === currentUser}
            />
          ))
        ) : (
          <div className="no-messages">
            {/* Start a new conversation with {selectedConversation.user_name} */}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <Button type="text" icon={<PaperClipOutlined />} />
        <Input.TextArea
          className="message-input"
          placeholder="Type a message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoSize={{ minRows: 1, maxRows: 6 }}
        />
        <Button
          type="text"
          icon={messageInput ? <SendOutlined /> : <SmileOutlined />}
          onClick={handleSend}
          disabled={!messageInput.trim()}
        />
      </div>
    </div>
  );
};

export default ChatArea;