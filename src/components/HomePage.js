import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{ background: 'linear-gradient(135deg, var(--primary), #6610f2)', color: '#fff', padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Free Legal Help, Powered by AI</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem', fontSize: '1.125rem' }}>
          Get instant legal guidance, generate documents, and find legal aid near you. LegalBridge India makes justice accessible to everyone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/chat" className="btn primary" style={{ backgroundColor: '#fff', color: 'var(--primary)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius)', fontWeight: '500' }}>Get Legal Help Now</Link>
          <Link to="/documents" className="btn secondary" style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius)', border: '1px solid #fff', fontWeight: '500' }}>Generate Legal Notice</Link>
        </div>
      </section>
      {/* Stats */}
      <section style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', backgroundColor: '#fff' }}>
        <div style={{ textAlign: 'center', margin: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>50,000+</h3>
          <p style={{ margin: 0, color: '#666' }}>Users Helped</p>
        </div>
        <div style={{ textAlign: 'center', margin: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>1,00,000+</h3>
          <p style={{ margin: 0, color: '#666' }}>Documents Generated</p>
        </div>
        <div style={{ textAlign: 'center', margin: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--primary)' }}>25,000+</h3>
          <p style={{ margin: 0, color: '#666' }}>Legal Aid Connections</p>
        </div>
      </section>
      {/* Features */}
      <section style={{ padding: '4rem 1rem' }}>
        <h3 className="section-title" style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 600, marginBottom: '2rem' }}>Everything You Need for Legal Help</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--light)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <i className="fas fa-robot" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
            <h4 style={{ margin: '0.75rem 0 0.5rem' }}>AI Legal Assistant</h4>
            <p style={{ fontSize: '0.95rem', color: '#555' }}>Describe your legal issue in plain language and get instant guidance.</p>
          </div>
          <div style={{ backgroundColor: 'var(--light)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <i className="fas fa-file-contract" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
            <h4 style={{ margin: '0.75rem 0 0.5rem' }}>Document Generator</h4>
            <p style={{ fontSize: '0.95rem', color: '#555' }}>Generate professional legal documents including notices, complaints and RTIs.</p>
          </div>
          <div style={{ backgroundColor: 'var(--light)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <i className="fas fa-map-marker-alt" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
            <h4 style={{ margin: '0.75rem 0 0.5rem' }}>Legal Aid Finder</h4>
            <p style={{ fontSize: '0.95rem', color: '#555' }}>Find pro bono lawyers, legal aid clinics and NGOs near you.</p>
          </div>
          <div style={{ backgroundColor: 'var(--light)', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <i className="fas fa-calendar-check" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
            <h4 style={{ margin: '0.75rem 0 0.5rem' }}>Case Tracker</h4>
            <p style={{ fontSize: '0.95rem', color: '#555' }}>Keep a record of your documents, deadlines and tasks.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;