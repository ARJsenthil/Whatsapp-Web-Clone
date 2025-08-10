import React from 'react';
import { Layout } from 'antd';
import ChatPage from './pages/ChatPage';
import './styles/App.css';
function App() {
  return (
    <Layout className="app-layout">
      <ChatPage />
    </Layout>
  );
}
export default App;