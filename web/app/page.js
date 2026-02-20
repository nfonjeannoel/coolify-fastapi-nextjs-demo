'use client';

import { useState } from 'react';

export default function HomePage() {
  const [name, setName] = useState('Jeannoel');
  const [message, setMessage] = useState('Click the button to talk to the backend.');
  const [loading, setLoading] = useState(false);

  async function pingBackend() {
    setLoading(true);
    try {
      const res = await fetch(`/api/hello?name=${encodeURIComponent(name)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Request failed');
      setMessage(data.message || 'No message returned');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: 'clamp(16px, 3vw, 36px)',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #22d3ee 100%)',
        color: '#e2e8f0',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <section
        style={{
          width: 'min(980px, 100%)',
          borderRadius: 24,
          border: '1px solid rgba(255,255,255,.22)',
          background: 'rgba(15, 23, 42, .45)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 24px 80px rgba(2, 6, 23, .4)',
          padding: 'clamp(18px, 4vw, 42px)'
        }}
      >
        <div style={{ display: 'grid', gap: 14 }}>
          <span style={{ opacity: .85, fontSize: 14, letterSpacing: .5 }}>OPENCLAW x COOLIFY DEMO</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 5vw, 3.4rem)', lineHeight: 1.08 }}>
            Full-screen Responsive Test Page
          </h1>
          <p style={{ margin: 0, opacity: .92, maxWidth: 760 }}>
            Designed with a Gemini-inspired modern style, but no runtime AI key required. The frontend talks to the backend through a server-side proxy route.
          </p>
        </div>

        <div
          style={{
            marginTop: 24,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: '1fr auto'
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter your name'
            style={{
              width: '100%',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,.25)',
              background: 'rgba(2,6,23,.55)',
              color: '#fff',
              padding: '12px 14px',
              fontSize: 16,
              outline: 'none'
            }}
          />
          <button
            onClick={pingBackend}
            disabled={loading}
            style={{
              border: 0,
              borderRadius: 12,
              padding: '12px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              background: loading ? '#94a3b8' : '#22d3ee',
              color: '#0f172a',
              minWidth: 150
            }}
          >
            {loading ? 'Talking...' : 'Talk to backend'}
          </button>
        </div>

        <div
          style={{
            marginTop: 14,
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,.2)',
            background: 'rgba(2,6,23,.65)',
            padding: 14,
            minHeight: 72,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>{message}</span>
        </div>
      </section>
    </main>
  );
}
