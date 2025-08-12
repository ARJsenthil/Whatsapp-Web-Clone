import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { CheckOutlined, DoubleRightOutlined } from '@ant-design/icons';
import '../assets/styles/Message.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const MessageStatus = ({ status, timestamp }) => {
  const getStatusIcon = () => {
    switch(status) {
      case 'sent': 
        return <CheckOutlined className="status-icon sent" />;
      case 'delivered': 
        return <DoubleRightOutlined className="status-icon delivered" />;
      case 'read': 
        return <DoubleRightOutlined className="status-icon read" />;
      default: 
        return <CheckOutlined className="status-icon" />;
    }
  };

  return (
    <Tooltip title={dayjs(timestamp).format('h:mm A · MMM D, YYYY')}>
      <span className="message-status">
        {getStatusIcon()}
        {dayjs(timestamp).format('h:mm A')}
      </span>
    </Tooltip>
  );
};

const Message = ({ message, isOutgoing }) => {
  if (!message) return null;

  return (
    <div className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      <div className="message-content">
        <div className="message-bubble">
          {message.text}
        </div>
        <div className="message-meta">
          {isOutgoing ? (
            <MessageStatus status={message.status} timestamp={message.timestamp} />
          ) : (
            <span className="time">
              {dayjs(message.timestamp).format('h:mm A')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;