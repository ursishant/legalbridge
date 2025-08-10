import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatPage from './components/ChatPage';
import DocumentsPage from './components/DocumentsPage';
import LegalAidPage from './components/LegalAidPage';
import DashboardPage from './components/DashboardPage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';

const App = () => {
  return (
    <div className="app">
      <header className="navbar">
        <div className="nav-container">
          <h1 className="logo"><Link to="/">LegalBridge India</Link></h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/chat">AI Chat</Link></li>
              <li><Link to="/documents">Documents</Link></li>
              <li><Link to="/legalaid">Legal Aid</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/legalaid" element={<LegalAidPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} LegalBridge India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;