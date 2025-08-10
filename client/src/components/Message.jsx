// client/src/components/Message.jsx
import React from 'react';
import { Avatar } from 'antd';
import { CheckOutlined, DoubleRightOutlined } from '@ant-design/icons';
import '../styles/Message.css';
const Message = ({ message, isOutgoing }) => {
  const renderStatusIcon = () => {
    if (!isOutgoing) return null;
    
    switch(message.status) {
      case 'sent': return <CheckOutlined className="status-icon" />;
      case 'delivered': return <DoubleRightOutlined className="status-icon" />;
      case 'read': return <DoubleRightOutlined className="status-icon read" />;
      default: return null;
    }
  };
  return (
    <div className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      {!isOutgoing && <Avatar src="https://via.placeholder.com/32" />}
      <div className="message-content">
        <div className="message-bubble">
          {message.text}
        </div>
        <div className="message-meta">
          <span className="time">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
};
export default Message;