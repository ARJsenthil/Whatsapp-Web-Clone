import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import axios from 'axios';
import '../styles/ChatPage.css';
const { Content } = Layout;
const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser] = useState('918329446654'); // Business number from payload
  useEffect(() => {
    fetchConversations();
  }, []);
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.wa_id);
    }
  }, [selectedConversation]);
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API+'/api/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };
  const API = 'https://whatsapp-web-clone-zbqt.onrender.com';
  const fetchMessages = async (wa_id) => {
    try {
      setLoading(true);
      const response = await axios.get(API+`/api/conversations/${wa_id}/messages`, {
        params: { currentUser }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !selectedConversation) return;
    try {
      const response = await axios.post(
        API+`/api/conversations/${selectedConversation.wa_id}/messages`,
        { text: messageText, currentUser }
      );
      
      setMessages([...messages, response.data]);
      
      // Update conversation list


      setConversations(conversations.map(conv => 
        conv.wa_id === selectedConversation.wa_id ? { 
          ...conv, 
          last_message: messageText,
          last_message_time: new Date().toISOString()
        } : conv
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  return (
    <Content className="chat-page-content">
      <div className="whatsapp-container">
        <Sidebar 
          conversations={conversations} 
          onSelectConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
          loading={loading}
        />
        <ChatArea 
          selectedConversation={selectedConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUser={currentUser}
        />
      </div>
    </Content>
  );
};
export default ChatPage;