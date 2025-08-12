import React, { useState } from 'react';
import { Input, List, Avatar, Badge } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import '../assets/styles/ChatList.css';
import default_avatar from '../assets/images/default-avatar.png';
import user_avatar from '../assets/images/user-avatar.png';
const ChatList = ({ conversations, onSelectChat, selectedChat, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-list-container">
      {/* Header */}
      <div className="chat-list-header">
        <div className="profile-section">
          <Avatar size={40} src={user_avatar} />
        </div>
        <div className="action-icons">
          <FilterOutlined className="icon" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Input 
          placeholder="Search or start new chat"
          prefix={<SearchOutlined />}
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </div>

      {/* Categories */}
      <div className="chat-categories">
        <span className="active">All</span>
        <span>Unread</span>
        <span>Favourites</span>
        <span>Groups</span>
      </div>

      {/* Conversation List */}
      <div className="conversations">
        <List
          loading={loading}
          dataSource={filteredConversations}
          renderItem={(conversation) => (
            <List.Item
              className={`conversation-item ${selectedChat?._id === conversation._id ? 'active' : ''}`}
              onClick={() => onSelectChat(conversation)}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={conversation.unread_count} offset={[-10, 0]}>
                    <Avatar src={conversation.avatar || default_avatar} />
                  </Badge>
                }
                title={<div className="conversation-title">{conversation.user_name}</div>}
                description={
                  <div className="conversation-preview">
                    <span className="message-preview">
                      {conversation.last_message?.length > 30 
                        ? `${conversation.last_message.substring(0, 30)}...` 
                        : conversation.last_message}
                    </span>
                    <span className="message-time">
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>

    </div>
  );
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export default ChatList;