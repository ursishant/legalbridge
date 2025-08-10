import React, { useState, useEffect } from 'react';

/*
 * Legal Aid Finder page
 * This component displays a list of legal aid organisations and allows
 * the user to search by name, city or services. Each organisation card
 * has a "Contact" button which increments a contact count stored in
 * localStorage and logs the event to a server (or console) for tracking.
 */
const LegalAidPage = () => {
  // Predefined organisations list; in a real app this could come from an API
  const organisations = [
    {
      name: 'Delhi State Legal Services Authority',
      city: 'Delhi',
      address: 'Patiala House Courts Complex, New Delhi',
      phone: '011-2338 4781',
      services: 'Free legal aid, Lok Adalat, mediation'
    },
    {
      name: 'Maharashtra Legal Services Authority',
      city: 'Mumbai',
      address: 'High Court Building, Mumbai',
      phone: '022-2262 3037',
      services: 'Legal aid clinics, legal awareness camps'
    },
    {
      name: 'Rajasthan State Legal Services Authority',
      city: 'Jaipur',
      address: 'Rajasthan High Court, Jaipur Bench',
      phone: '0141-222 7481',
      services: 'Free legal services, Lok Adalats'
    },
    {
      name: 'Gujarat State Legal Services Authority',
      city: 'Ahmedabad',
      address: 'Sola Civil Courts, Ahmedabad',
      phone: '079-2766 5791',
      services: 'Legal aid, mediation, counselling'
    },
    {
      name: 'West Bengal Legal Services Authority',
      city: 'Kolkata',
      address: 'Bankshall Court, Kolkata',
      phone: '033-2248 5180',
      services: 'Legal aid, mediation, advice'
    },
    {
      name: 'Tamil Nadu State Legal Services Authority',
      city: 'Chennai',
      address: 'High Court Complex, Chennai',
      phone: '044-2534 1565',
      services: 'Lok Adalat, legal aid, legal literacy'
    },
    {
      name: 'Karnataka State Legal Services Authority',
      city: 'Bengaluru',
      address: 'Nyaya Degula Building, H Siddaiah Road, Bengaluru',
      phone: '080-2211 3333',
      services: 'Legal aid clinics, mediation, counselling'
    },
    {
      name: 'Uttar Pradesh State Legal Services Authority',
      city: 'Lucknow',
      address: 'Qaiserbagh, Lucknow',
      phone: '0522-223 7496',
      services: 'Free legal services, Lok Adalat'
    },
    {
      name: 'Telangana Legal Services Authority',
      city: 'Hyderabad',
      address: 'High Court for the State of Telangana, Hyderabad',
      phone: '040-2344 5800',
      services: 'Legal aid, mediation, legal awareness'
    },
    {
      name: 'Maharashtra National Law School Legal Aid Clinic',
      city: 'Nagpur',
      address: 'MNLU Nagpur campus, Nagpur',
      phone: '0712-255 2564',
      services: 'Student legal aid clinic, advice sessions'
    }
  ];

  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState({});
  // Track which organisations have had their contact details revealed
  const [revealed, setRevealed] = useState({});
  const [modalOrg, setModalOrg] = useState(null);
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');


  useEffect(() => {
    // Load counts from localStorage on mount
    const stored = JSON.parse(localStorage.getItem('legalbridge_contact_counts') || '{}');
    setCounts(stored);
    // Load revealed orgs from localStorage
    const rev = JSON.parse(localStorage.getItem('legalbridge_revealed') || '{}');
    setRevealed(rev);
  }, []);

  const saveCounts = (newCounts) => {
    setCounts(newCounts);
    localStorage.setItem('legalbridge_contact_counts', JSON.stringify(newCounts));
  };

  const handleContact = (org) => {
    // When user clicks contact we open modal to collect details
    setModalOrg(org);
    setStep(1);
    setUserName('');
    setUserPhone('');
    setGeneratedOtp('');
    setEnteredOtp('');
  };

  // Finalise contact: update counts, save log and send to backend
  const finaliseContact = (org) => {
    const newCounts = { ...counts };
    newCounts[org.name] = (newCounts[org.name] || 0) + 1;
    saveCounts(newCounts);
    // Log contact event to localStorage log
    const log = JSON.parse(localStorage.getItem('legalbridge_contact_log') || '[]');
    log.push({ org: org.name, timestamp: new Date().toISOString(), name: userName, phone: userPhone });
    localStorage.setItem('legalbridge_contact_log', JSON.stringify(log));
    // Send to backend with user details
    try {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organisation: org.name, name: userName, phone: userPhone, timestamp: new Date().toISOString() })
      });
    } catch (err) {
      console.error('Failed to send contact data', err);
    }
    // Mark organisation as revealed so its details are shown
    setRevealed((prev) => {
      const updated = { ...prev, [org.name]: true };
      // Persist revealed status
      localStorage.setItem('legalbridge_revealed', JSON.stringify(updated));
      return updated;
    });
  };

  const filtered = organisations.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      o.name.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.services.toLowerCase().includes(q)
    );
  });

  return (
    <div className="legalaid-page">
      <h2 className="section-title" style={{ textAlign: 'center' }}>Find Legal Aid Near You</h2>
      <p style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', color: '#555' }}>Search for government legal aid services, pro bono lawyers and non‑profit organisations in your area. Click on contact to record your interest and track interactions.</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter city, organisation or service..."
          style={{ padding: '0.6rem 0.9rem', border: '1px solid #ccc', borderRadius: 'var(--radius)', width: '320px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', maxWidth: '1100px', margin: '0 auto' }}>
        {filtered.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>No organisations found for your search.</p>
        ) : (
          filtered.map((org) => (
            <div key={org.name} style={{ border: '1px solid #e5e7eb', borderRadius: 'var(--radius)', backgroundColor: '#fff', padding: '1rem 1.25rem', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)' }}>{org.name}</h4>
              <p style={{ margin: 0 }}><strong>City:</strong> {org.city}</p>
              {/* Show address and phone only after contact is verified */}
              {revealed[org.name] && (
                <>
                  <p style={{ margin: 0 }}><strong>Address:</strong> {org.address}</p>
                  <p style={{ margin: 0 }}><strong>Phone:</strong> {org.phone}</p>
                </>
              )}
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}><strong>Services:</strong> {org.services}</p>
              <button
                onClick={() => handleContact(org)}
                style={{ marginTop: '0.6rem', alignSelf: 'flex-start', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
              >
                {counts[org.name] ? `Contacted (${counts[org.name]})` : 'Contact'}
              </button>
            </div>
          ))
        )}
      </div>
      <p style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center', marginTop: '2rem' }}>
        Contact information stays on your device. Touching "Contact" will record your interest and help you keep track of organisations you’ve reached out to.
      </p>

      {/* Modal for collecting user details and OTP */}
      {modalOrg && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 'var(--radius)', padding: '1.5rem', width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--primary)' }}>Contact {modalOrg.name}</h3>
            {step === 1 && (
              <>
                <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#555' }}>Please enter your name and phone/email to proceed.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="user-name" style={{ marginBottom: '0.25rem', fontWeight: 500 }}>Your Name</label>
                    <input id="user-name" value={userName} onChange={(e) => setUserName(e.target.value)} required style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 'var(--radius)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="user-phone" style={{ marginBottom: '0.25rem', fontWeight: 500 }}>Phone or Email</label>
                    <input id="user-phone" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} required style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 'var(--radius)' }} />
                  </div>
                  <button onClick={() => {
                    if (!userName.trim() || !userPhone.trim()) return;
                    // Generate a fake OTP for demo; in real app you'd send via SMS/email
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(code);
                    setStep(2);
                  }} style={{ backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.6rem 1.2rem', cursor: 'pointer' }}>Send OTP</button>
                  <button onClick={() => setModalOrg(null)} style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Cancel</button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#555' }}>An OTP has been sent to your phone/email (for demo: <strong>{generatedOtp}</strong>). Please enter it below to confirm contact.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} placeholder="Enter OTP" style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 'var(--radius)' }} />
                  <button onClick={() => {
                    if (enteredOtp === generatedOtp) {
                      finaliseContact(modalOrg);
                      setModalOrg(null);
                    } else {
                      alert('Incorrect OTP. Please try again.');
                    }
                  }} style={{ backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.6rem 1.2rem', cursor: 'pointer' }}>Verify & Save</button>
                  <button onClick={() => setModalOrg(null)} style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalAidPage;