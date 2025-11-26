import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Botpress configuration - these can be moved to .env if needed
const BOTPRESS_WEBCHAT_URL = 'https://cdn.botpress.cloud/webchat/v3.3/shareable.html';
const BOTPRESS_CONFIG_URL = 'https://files.bpcontent.cloud/2025/11/09/17/20251109173139-QPZXD221.json';

export function AIChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatbotUrl, setChatbotUrl] = useState('');

  useEffect(() => {
    if (user?.email) {
      // Clear previous user's Botpress chat data
      const currentUserId = btoa(user.email);
      const storedUserId = localStorage.getItem('bp-web-widget-userId');
      
      // If different user, clear Botpress localStorage items
      if (storedUserId && storedUserId !== currentUserId) {
        // Clear all Botpress related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('bp-') || key.includes('botpress')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Create unique chat identifier based on user email
      const userIdentifier = btoa(user.email); // Base64 encode email for URL safety
      
      // Build the chat URL with user context
      const url = `${BOTPRESS_WEBCHAT_URL}?configUrl=${encodeURIComponent(BOTPRESS_CONFIG_URL)}&userId=${userIdentifier}`;
      
      setChatbotUrl(url);
      
      // Set localStorage for user isolation in Botpress
      localStorage.setItem('bp-web-widget-userId', userIdentifier);
      localStorage.setItem('bp-web-widget-userEmail', user.email);
    }
  }, [user?.email]);

  const handleHome = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to access the chat.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col h-screen w-full">
      {/* Home Button - Top Left */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleHome}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        title="Back to Dashboard"
      >
        <Home className="w-6 h-6" />
      </motion.button>

      {/* Chat Interface - Embedded iframe */}
      <div className="flex-1 relative overflow-hidden pt-2 w-full h-full">
        {chatbotUrl ? (
          <iframe
            src={chatbotUrl}
            className="w-full h-full border-0"
            title="Zeni AI Chatbot"
            allow="microphone; camera"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Loading chat...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}