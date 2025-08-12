import React from 'react';
import { Layout } from 'antd';
import ChatPage from './pages/ChatPage';
import './assets/styles/App.css';
import { useEffect } from 'react';
function App() {

  // Prevent zoom on input focus in mobile browsers
useEffect(() => {
  const disableZoom = () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (window.innerWidth <= 768) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1');
    }
  };

  window.addEventListener('resize', disableZoom);
  disableZoom(); // Run initially

  return () => window.removeEventListener('resize', disableZoom);
}, []);
  return (
    <Layout className="app-layout">
      <ChatPage />
    </Layout>
  );
}
export default App;