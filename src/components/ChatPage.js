import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const API_KEY = 'AIzaSyBBnHltxn2ip2T5yEpTYqgRX-avoO8T5kU';

// Initialize GoogleGenerativeAI once
let genAIInstance;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load history on mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('legalbridge_chat_history') || '[]');
    if (history.length === 0) {
      // Start conversation
      setMessages([{ sender: 'bot', text: "Hello! I'm your LegalBridge AI assistant. How may I assist you today?" }]);
    } else {
      setMessages(history);
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    localStorage.setItem('legalbridge_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Fallback rule-based response
  const fallbackResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('rent') || lower.includes('security deposit')) {
      return 'Under the Rent Control Act, you have rights to your security deposit. You can send a legal notice requesting the deposit within 30 days.';
    }
    if (lower.includes('rti') || lower.includes('information')) {
      return 'You can file a Right To Information (RTI) request with the concerned public authority. Provide your details and the information sought; a response must be provided within 30 days.';
    }
    if (lower.includes('complaint') || lower.includes('police')) {
      return 'To file a police complaint, write a detailed complaint letter describing the incident and submit it to the nearest police station. Our document generator can help you draft it.';
    }
    if (lower.includes('bail') || lower.includes('arrest')) {
      return 'If someone has been arrested, you can apply for bail. Provide details about the arrest and the offence. Our platform offers a bail application template under Documents.';
    }
    if (lower.includes('thank')) {
      return 'You’re welcome! If you need anything else, feel free to ask.';
    }
    return 'I am an AI assistant trained on Indian laws. Please provide more details about your issue or explore our Document Generator and Legal Aid Finder.';
  };

  // Instantiate the GoogleGenerativeAI client
  const genAIRef = useRef(null);
  useEffect(() => {
    try {
      genAIRef.current = new GoogleGenAI(API_KEY);
    } catch (err) {
      console.error('Failed to initialise generative AI', err);
    }
  }, []);

  // Call Google Generative AI via the SDK
  const fetchGeminiResponse = async (message) => {
    if (!genAIRef.current) return null;
    try {
      const model = genAIRef.current.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(message);
      const response = result.response;
      // The SDK returns a response object with a text() method
      if (response && typeof response.text === 'function') {
        return response.text();
      }
      // Fallback if structure differs
      return null;
    } catch (err) {
      console.error('Gemini SDK error', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);
    let response;
    try {
      response = await fetchGeminiResponse(text);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    setMessages((prev) => [...prev.filter((m) => m.text !== '...'), { sender: 'bot', text: response || fallbackResponse(text) }]);
  };

  return (
    <div className="chat-page">
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>AI Legal Assistant</h2>
      <div className="chat-card" style={{ margin: '0 auto', maxWidth: '800px' }}>
        <div className="chat-header">
          <div className="chat-title">Legal Assistant</div>
          <div className="chat-status"><span className="online-dot"></span> Online</div>
        </div>
        <div className="chat-box" style={{ flex: 1, backgroundColor: '#fff', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'user' ? 'var(--primary)' : '#e9ecef', color: msg.sender === 'user' ? '#fff' : '#333', maxWidth: '80%', padding: '0.6rem 0.9rem', borderRadius: 'var(--radius)', borderBottomRightRadius: msg.sender === 'user' ? 0 : undefined, borderBottomLeftRadius: msg.sender !== 'user' ? 0 : undefined }}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="message bot">...</div>}
        </div>
        {/* Pre-asked questions */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid #e9ecef', backgroundColor: '#f8f9fa' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#555' }}>Common questions:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { text: 'Property dispute', icon: 'fa-home', prompt: 'I have a property dispute with my neighbour. What should I do?' },
              { text: 'Consumer complaint', icon: 'fa-shopping-cart', prompt: 'I purchased an item that is defective. How can I file a consumer complaint?' },
              { text: 'Employment issues', icon: 'fa-briefcase', prompt: 'My employer is withholding my salary. What are my rights?' },
              { text: 'Family law', icon: 'fa-users', prompt: 'I need advice on filing for divorce in India.' }
            ].map((item) => (
              <button key={item.text} onClick={() => {
                setInput(item.prompt);
                // Use a synthetic event to trigger submission
                handleSubmit({ preventDefault: () => {} });
              }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: 'var(--radius)', padding: '0.4rem 0.6rem', fontSize: '0.85rem', cursor: 'pointer', color: '#333' }}>
                <i className={`fas ${item.icon}`} style={{ color: 'var(--primary)' }}></i> {item.text}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="chat-form" style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid #e9ecef' }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your legal problem in simple words..." style={{ flex: 1, padding: '0.6rem 0.9rem', border: '1px solid #ccc', borderRadius: 'var(--radius)', fontSize: '1rem' }} />
          <button type="submit" className="send-btn" style={{ backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;