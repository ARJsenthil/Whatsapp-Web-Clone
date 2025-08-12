import React, { useState, useEffect } from 'react';
import { Button, Drawer, Layout, Spin } from 'antd';
import ChatList from '../components/ChatList';
import ChatArea from '../components/ChatArea';
import axios from 'axios';
import '../styles/ChatPage.css';
import { API_BASE_URL } from '../common/APi';
import { MenuOutlined } from '@ant-design/icons';

const { Content } = Layout;

const ChatPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChatList, setShowChatList] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser] = useState('user123'); // This should come from auth context

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChatList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/conversations`);
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/conversations/${selectedConversation._id}/messages`,
          { params: { currentUser } }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, currentUser]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !selectedConversation) return;
    const tempId = `temp-${Date.now()}`;

    try {
      // Optimistic update
      const newMessage = {
        _id: tempId,
        wa_id: selectedConversation._id,
        user_name: currentUser,
        from: currentUser,
        timestamp: new Date().toISOString(),
        text: messageText,
        type: 'text',
        status: 'sent',
        direction: 'outbound'
      };

      setMessages(prev => [...prev, newMessage]);
      setConversations(prev =>
        prev.map(conv =>
          conv._id === selectedConversation._id
            ? {
                ...conv,
                last_message: messageText,
                last_message_time: new Date().toISOString()
              }
            : conv
        )
      );

      // Actual API call
      const response = await axios.post(
        `${API_BASE_URL}/api/conversations/${selectedConversation._id}/messages`,
        { text: messageText, currentUser }
      );

      // Replace temp message with actual message from server
      setMessages(prev =>
        prev.map(msg => (msg._id === tempId ? response.data : msg))
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      // Rollback optimistic update
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  };
  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };

  return (
    <Content className="chat-page-content">
      <div className="whatsapp-container">
        {/* Desktop Chat List */}
        {!isMobile && (
          <ChatList
            conversations={conversations}
            onSelectChat={setSelectedConversation}
            selectedChat={selectedConversation}
            loading={loading}
          />
        )}

        {/* Mobile Chat List Drawer */}
        {isMobile && (
          <Drawer
            placement="left"
            visible={showChatList}
            onClose={toggleChatList}
            width="100%"
            bodyStyle={{ padding: 0 }}
            headerStyle={{ display: 'none' }}
          >
            <ChatList
              conversations={conversations}
              onSelectChat={(chat) => {
                setSelectedConversation(chat);
                setShowChatList(false);
              }}
              selectedChat={selectedConversation}
              loading={loading}
            />
          </Drawer>
        )}

        {/* Chat Area */}
        {(!isMobile || selectedConversation) && (
          <ChatArea
            selectedConversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
            isMobile={isMobile}
            onBackToChatList={toggleChatList}
          />
        )}

        {/* Empty State for Mobile */}
        {isMobile && !selectedConversation && (
          <div className="mobile-empty-state">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </Content>
  );
};

export default ChatPage;