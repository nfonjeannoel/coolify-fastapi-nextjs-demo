'use client';

import { useState } from 'react';

export default function HomePage() {
  const [name, setName] = useState('Jeannoel');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  async function callApi() {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch(`${apiUrl}/hello?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      setResult(data.message || JSON.stringify(data));
    } catch (err) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Coolify Demo: Next.js + FastAPI</h1>
      <p>API URL: <code>{apiUrl}</code></p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          style={{ padding: 8, flex: 1 }}
        />
        <button onClick={callApi} disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Calling...' : 'Call API'}
        </button>
      </div>

      <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
        {result || 'No response yet'}
      </div>
    </main>
  );
}
