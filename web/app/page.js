'use client';

import { useState } from 'react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('Build me a playful hero section for a fintech app.');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Request failed');
      setResult(data.text || '(No text returned)');
    } catch (err) {
      setResult(`Error: ${err.message}`);
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
        background: 'radial-gradient(circle at 10% 20%, #141e30 0%, #243b55 50%, #0f172a 100%)',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'grid',
        placeItems: 'center'
      }}
    >
      <section
        style={{
          width: 'min(960px, 100%)',
          border: '1px solid rgba(255,255,255,.15)',
          borderRadius: 20,
          background: 'rgba(255,255,255,.06)',
          backdropFilter: 'blur(8px)',
          padding: 'clamp(16px, 3vw, 32px)',
          boxShadow: '0 20px 80px rgba(0,0,0,.35)'
        }}
      >
        <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}>
          Gemini 3.1 Creative Playground
        </h1>
        <p style={{ opacity: .9, marginTop: 10 }}>
          100vh/100vw responsive demo: frontend talks to backend, backend calls Gemini.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          placeholder='Describe what you want Gemini to generate...'
          style={{
            width: '100%',
            marginTop: 16,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,.25)',
            padding: 12,
            resize: 'vertical',
            background: 'rgba(15,23,42,.6)',
            color: '#fff'
          }}
        />

        <button
          onClick={generate}
          disabled={loading}
          style={{
            marginTop: 12,
            border: 0,
            borderRadius: 12,
            padding: '10px 16px',
            fontWeight: 700,
            cursor: 'pointer',
            background: loading ? '#64748b' : '#22d3ee',
            color: '#0b1220'
          }}
        >
          {loading ? 'Generating...' : 'Generate with Gemini 3.1'}
        </button>

        <div
          style={{
            marginTop: 18,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,.2)',
            background: 'rgba(2,6,23,.7)',
            padding: 14,
            minHeight: 140,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5
          }}
        >
          {result || 'Output will appear here...'}
        </div>
      </section>
    </main>
  );
}
