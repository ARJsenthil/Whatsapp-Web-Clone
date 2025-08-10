// client/src/components/Sidebar.jsx
import React from 'react';
import { Avatar, Input, List, Badge } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import '../styles/Sidebar.css';
const Sidebar = ({ conversations, onSelectConversation, selectedConversation, loading }) => {
  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <Avatar size={40} src="https://via.placeholder.com/40" />
        <div className="header-icons">
          <FilterOutlined />
        </div>
      </div>
      {/* Search */}
      <div className="sidebar-search">
        <Input 
          placeholder="Search or start new chat"
          prefix={<SearchOutlined />}
          className="search-input"
        />
      </div>
      {/* Categories */}
      <div className="sidebar-categories">
        <div className="category active">All</div>
        <div className="category">Unread</div>
        <div className="category">Favourites</div>
        <div className="category">Groups</div>
      </div>
      {/* Conversations */}
      <div className="conversations-list">
        <List
          loading={loading}
          dataSource={conversations}
          renderItem={conversation => (
            <List.Item
              className={`conversation-item ${selectedConversation?.wa_id === conversation.wa_id ? 'active' : ''}`}
              onClick={() => onSelectConversation(conversation)}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={conversation.unread_count} offset={[-10, 0]}>
                    <Avatar src="https://via.placeholder.com/40" />
                  </Badge>
                }
                title={conversation.user_name}
                description={
                  <div className="conversation-preview">
                    <span className="last-message">{conversation.last_message}</span>
                    <span className="last-message-time">
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
      {/* Download Banner */}
      <div className="download-banner">
        <Avatar size={40} src="https://via.placeholder.com/40" />
        <div className="download-text">
          <h4>Download WhatsApp for Windows</h4>
          <p>Make calls, share your screen and get a faster experience</p>
        </div>
        <div className="download-button">Download</div>
      </div>
    </div>
  );
};
// Helper function to format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
export default Sidebar;