'use client';

// NewsletterForm.js — vendor-agnostic newsletter signup.
// Reads NEXT_PUBLIC_NEWSLETTER_ENDPOINT for the form action URL. Common values:
//   Buttondown:  https://buttondown.email/api/emails/embed-subscribe/{username}
//   Mailchimp:   https://{...}.list-manage.com/subscribe/post?u=...&id=...
//   Loops:       https://app.loops.so/api/newsletter-form/{form-id}
//   ConvertKit:  https://app.convertkit.com/forms/{form-id}/subscriptions
// If the env var is unset, the form falls back to a mailto: link.

import { useState } from 'react';

const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || '';

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    if (!ENDPOINT) {
      // Fallback: open the user's mail client
      window.location.href = `mailto:editorial@50bestneighborhoods.com?subject=Newsletter%20signup&body=Please%20add%20me%20to%20the%2050%20Best%20Neighborhoods%20newsletter.%20Email:%20${encodeURIComponent(email)}`;
      setStatus('success');
      return;
    }
    setStatus('submitting');
    try {
      const formData = new FormData();
      formData.append('email', email);
      await fetch(ENDPOINT, { method: 'POST', body: formData, mode: 'no-cors' });
      setStatus('success');
      setEmail('');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: compact ? '14px 16px' : 24,
        border: '1px solid rgba(201,162,75,0.4)',
        background: 'rgba(201,162,75,0.08)',
        borderRadius: 2,
        textAlign: 'center',
      }}>
        <div className="eyebrow">Subscribed</div>
        <p style={{ color: '#f5f0e8', fontSize: 16, marginTop: 8, marginBottom: 0 }}>
          Thank you. Look out for our next dispatch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{
      display: 'flex',
      flexDirection: compact ? 'row' : 'column',
      gap: 10,
      flexWrap: 'wrap',
      alignItems: compact ? 'center' : 'stretch',
    }}>
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
        placeholder="your@email.com"
        required
        style={{
          flex: '1 1 240px',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.04)',
          color: '#f5f0e8',
          border: '1px solid rgba(201,162,75,0.3)',
          borderRadius: 2,
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #c9a24b, #8a6e32)',
          color: '#0a0a0a',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: 2,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <div style={{ flexBasis: '100%', color: '#e57373', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
          {errorMsg}
        </div>
      )}
    </form>
  );
}
