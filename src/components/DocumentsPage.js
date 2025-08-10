import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const docTemplates = {
  legalNotice: {
    title: 'Legal Notice',
    description: 'Demand payment, compliance, or action',
    icon: 'fa-file-contract',
    fields: [
      { id: 'senderName', label: 'Your Name' },
      { id: 'senderAddress', label: 'Your Address' },
      { id: 'recipientName', label: 'Recipient Name' },
      { id: 'recipientAddress', label: 'Recipient Address' },
      { id: 'subject', label: 'Subject' },
      { id: 'issueDetails', label: 'Facts of the Case', type: 'textarea' },
      { id: 'reliefSought', label: 'Relief Sought' },
      { id: 'timePeriod', label: 'Time Period for Compliance' }
    ],
    template: `To,\n{recipientName}\n{recipientAddress}\n\nSubject: {subject}\n\nDear {recipientName},\n\nI, {senderName} residing at {senderAddress}, hereby give you notice regarding the following issue:\n\n{issueDetails}\n\nRelief Sought:\n{reliefSought}\n\nPlease take necessary action within {timePeriod} of receiving this notice.\n\nSincerely,\n{senderName}`
  },
  policeComplaint: {
    title: 'Police Complaint',
    description: 'File FIR or general complaint',
    icon: 'fa-file-lines',
    fields: [
      { id: 'complainantName', label: 'Complainant Name' },
      { id: 'complainantAddress', label: 'Complainant Address' },
      { id: 'accusedName', label: 'Accused Name' },
      { id: 'incidentDate', label: 'Incident Date' },
      { id: 'incidentDetails', label: 'Incident Details', type: 'textarea' }
    ],
    template: `To,\nThe Officer‑in‑Charge\nPolice Station\n\nSubject: Complaint against {accusedName}\n\nI, {complainantName} residing at {complainantAddress}, hereby lodge a complaint against {accusedName}. The incident occurred on {incidentDate}.\n\nDetails of the incident:\n\n{incidentDetails}\n\nI request you to register my complaint and take necessary action.\n\nYours faithfully,\n{complainantName}`
  },
  rtiApplication: {
    title: 'RTI Application',
    description: 'Right to information request',
    icon: 'fa-file-alt',
    fields: [
      { id: 'applicantName', label: 'Applicant Name' },
      { id: 'applicantAddress', label: 'Applicant Address' },
      { id: 'publicAuthority', label: 'Public Authority' },
      { id: 'informationRequested', label: 'Information Requested', type: 'textarea' }
    ],
    template: `To,\nThe Public Information Officer\n{publicAuthority}\n\nSubject: Request for information under the RTI Act, 2005\n\nDear Sir/Madam,\n\nI, {applicantName} residing at {applicantAddress}, request information on the following matters under the Right to Information Act, 2005:\n\n{informationRequested}\n\nPlease furnish the requested information within 30 days as prescribed under the Act.\n\nSincerely,\n{applicantName}`
  },
  bailApplication: {
    title: 'Bail Application',
    description: 'Apply for bail in court',
    icon: 'fa-scroll',
    fields: [
      { id: 'applicantName', label: 'Applicant Name' },
      { id: 'applicantAddress', label: 'Applicant Address' },
      { id: 'accusedName', label: 'Accused Name' },
      { id: 'offenceDetails', label: 'Offence Details', type: 'textarea' },
      { id: 'courtName', label: 'Court Name' }
    ],
    template: `In the court of {courtName}\n\nSubject: Bail application for {accusedName}\n\nI, {applicantName} residing at {applicantAddress}, respectfully submit this application seeking bail for {accusedName}. The details of the alleged offence are as follows:\n\n{offenceDetails}\n\nI request the honourable court to grant bail considering the circumstances and assure that {accusedName} will comply with all legal requirements.\n\nApplicant,\n{applicantName}`
  }
};

const DocumentsPage = () => {
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [generated, setGenerated] = useState('');

  const handleTemplateClick = (key) => {
    setSelected(key);
    setFormData({});
    setGenerated('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!selected) return;
    const template = docTemplates[selected].template;
    let result = template;
    docTemplates[selected].fields.forEach((field) => {
      const val = formData[field.id] || '';
      const regex = new RegExp('{' + field.id + '}', 'g');
      result = result.replace(regex, val);
    });
    setGenerated(result);
    // Save document to localStorage for dashboard
    const docs = JSON.parse(localStorage.getItem('legalbridge_documents') || '[]');
    const dynamic = formData.subject || formData.accusedName || formData.recipientName || formData.applicantName || '';
    const title = docTemplates[selected].title + (dynamic ? ' – ' + dynamic : '');
    docs.push({ id: Date.now(), type: selected, title, content: result, createdAt: new Date().toISOString() });
    localStorage.setItem('legalbridge_documents', JSON.stringify(docs));
  };

  const handleDownload = () => {
    // Generate a nicely formatted PDF with header, date and disclaimer
    if (!generated) return;
    const doc = new jsPDF();
    const marginX = 15;
    let y = 20;
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LegalBridge India', marginX, y);
    y += 8;
    doc.setFontSize(16);
    doc.text(docTemplates[selected].title.toUpperCase(), marginX, y);
    y += 8;
    doc.setFontSize(10);
    const today = new Date();
    doc.text(`Generated on: ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`, marginX, y);
    y += 10;
    // Body text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const bodyLines = doc.splitTextToSize(generated, 180);
    doc.text(bodyLines, marginX, y);
    // Disclaimer at bottom
    const disclaimer = 'Disclaimer: This document is generated by AI and should be reviewed by a legal professional.';
    const disclaimer2 = 'Generated by LegalBridge India - Free AI-Powered Legal Aid Platform';
    // Place disclaimer near bottom of page
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const bottomY = pageHeight - 25;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(disclaimer, marginX, bottomY);
    doc.text(disclaimer2, marginX, bottomY + 6);
    // Save file
    const baseTitle = selected ? docTemplates[selected].title.replace(/\s+/g, '_') : 'document';
    doc.save(baseTitle + '.pdf');
  };

  return (
    <div className="documents-page">
      <h2 className="section-title" style={{ textAlign: 'center' }}>Legal Document Generator</h2>
      <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', color: '#555' }}>Generate professional legal documents in minutes. Choose a template and fill in the details.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
        {/* Templates list */}
        <aside style={{ flex: '1 1 280px', maxWidth: '320px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.25rem' }}>Templates</h3>
          {Object.keys(docTemplates).map((key) => {
            const tpl = docTemplates[key];
            const isSelected = selected === key;
            return (
              <div key={key} onClick={() => handleTemplateClick(key)} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: 'var(--radius)', backgroundColor: isSelected ? '#eaf4ff' : '#fff', cursor: 'pointer', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '0.2rem' }}><i className={`fas ${tpl.icon}`}></i></div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 600 }}>{tpl.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#555' }}>{tpl.description}</div>
                </div>
              </div>
            );
          })}
        </aside>
        {/* Form and output */}
        <section style={{ flex: '2 1 400px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
          {selected && (
            <>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--primary)', fontSize: '1.25rem' }}>Generate {docTemplates[selected].title}</h3>
              <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                {docTemplates[selected].fields.map((field) => (
                  <div key={field.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor={field.id} style={{ marginBottom: '0.25rem', fontWeight: 500 }}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea id={field.id} name={field.id} required value={formData[field.id] || ''} onChange={handleChange} style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 'var(--radius)', minHeight: '120px', resize: 'vertical' }} />
                    ) : (
                      <input id={field.id} name={field.id} type="text" required value={formData[field.id] || ''} onChange={handleChange} style={{ padding: '0.5rem 0.75rem', border: '1px solid #ccc', borderRadius: 'var(--radius)' }} />
                    )}
                  </div>
                ))}
                <button type="submit" className="btn primary" style={{ backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.75rem 1.5rem', fontWeight: 500, cursor: 'pointer' }}>Generate {docTemplates[selected].title}</button>
              </form>
            </>
          )}
          {generated && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Generated Document</h4>
              <textarea readOnly value={generated} style={{ width: '100%', height: '260px', padding: '1rem', border: '1px solid #ccc', borderRadius: 'var(--radius)', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: 1.4, backgroundColor: '#fff', color: '#333' }} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button onClick={handleDownload} className="btn primary" style={{ backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '0.6rem 1.2rem', cursor: 'pointer' }}>Download PDF</button>
                <button onClick={() => { setSelected(null); setGenerated(''); setFormData({}); }} className="btn secondary" style={{ backgroundColor: '#fff', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius)', padding: '0.6rem 1.2rem', cursor: 'pointer' }}>Create Another</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DocumentsPage;