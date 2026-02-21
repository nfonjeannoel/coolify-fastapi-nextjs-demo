'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Simulated deployment log lines ─────────────────────────────── */
const DEPLOY_LOG = [
  '$ docker compose build --parallel',
  '  \u2713 api: FastAPI image built (python:3.12-slim)',
  '  \u2713 web: Next.js standalone built (node:20-alpine)',
  '$ git push origin main',
  '  \u2713 GitHub Actions: CI pipeline passed',
  '$ coolify deploy --production',
  '  \u2713 Containers pushed to VPS',
  '  \u2713 SSL/TLS certificates provisioned',
  '  \u2713 Health checks: all services green',
  '',
  '  \uD83D\uDE80 DEPLOYMENT COMPLETE \u2014 ALL SYSTEMS NOMINAL',
];

export default function Home() {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  const uptimeBaseRef = useRef(null);
  const uptimeOriginRef = useRef(null);

  const celebrateCanvasRef = useRef(null);
  const celebrateAnimRef = useRef(null);

  const [systemData, setSystemData] = useState(null);
  const [pingMs, setPingMs] = useState(null);
  const [pinging, setPinging] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [displayUptime, setDisplayUptime] = useState(null);
  const [hoverPing, setHoverPing] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [hoverCelebrate, setHoverCelebrate] = useState(false);

  /* ── Mount: fetch data + start terminal animation ────────────── */
  useEffect(() => {
    setMounted(true);
    fetchSystem();
    const ids = DEPLOY_LOG.map((_, i) =>
      setTimeout(() => setVisibleLogs(prev => [...prev, DEPLOY_LOG[i]]), 500 * (i + 1)),
    );
    return () => ids.forEach(clearTimeout);
  }, []);

  /* ── Sync uptime base whenever fresh data arrives ────────────── */
  useEffect(() => {
    if (systemData?.uptime_seconds != null) {
      uptimeBaseRef.current = systemData.uptime_seconds;
      uptimeOriginRef.current = Date.now();
    }
  }, [systemData?.uptime_seconds]);

  /* ── Tick displayed uptime every second ──────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      if (uptimeBaseRef.current != null) {
        const elapsed = Math.floor((Date.now() - uptimeOriginRef.current) / 1000);
        setDisplayUptime(uptimeBaseRef.current + elapsed);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  async function fetchSystem() {
    try {
      const t0 = performance.now();
      const res = await fetch('/api/system', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPingMs(Math.round(performance.now() - t0));
      setSystemData(data);
    } catch {
      /* page degrades gracefully without backend */
    }
  }

  async function handlePing() {
    setPinging(true);
    try {
      const t0 = performance.now();
      const res = await fetch('/api/system', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPingMs(Math.round(performance.now() - t0));
      setSystemData(data);
    } catch {
      setPingMs(-1);
    }
    setPinging(false);
  }

  /* ── Confetti celebration ──────────────────────────────────────── */
  function handleCelebrate() {
    if (celebrating) return;
    setCelebrating(true);

    const canvas = celebrateCanvasRef.current;
    if (!canvas) { setCelebrating(false); return; }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#ffd700', '#00ffd5', '#ff2d95', '#7b61ff', '#00ff88', '#ff6b35', '#00b4ff'];
    const SHAPES = ['rect', 'circle', 'strip'];
    const pieces = [];

    /* Spawn confetti from multiple burst points */
    for (let burst = 0; burst < 5; burst++) {
      const bx = canvas.width * (0.15 + Math.random() * 0.7);
      const by = canvas.height * (0.2 + Math.random() * 0.3);
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 10;
        pieces.push({
          x: bx, y: by,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 6,
          w: 4 + Math.random() * 8,
          h: 4 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.3,
          gravity: 0.12 + Math.random() * 0.06,
          drag: 0.98 + Math.random() * 0.015,
          opacity: 1,
          fade: 0.003 + Math.random() * 0.004,
        });
      }
    }

    let frame = 0;
    function animateConfetti() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      for (const p of pieces) {
        if (p.opacity <= 0) continue;
        alive++;
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        if (frame > 60) p.opacity -= p.fade;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -1, p.w, 2.5);
        }
        ctx.restore();
      }

      if (alive > 0) {
        celebrateAnimRef.current = requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCelebrating(false);
      }
    }

    cancelAnimationFrame(celebrateAnimRef.current);
    animateConfetti();
  }

  /* ── Canvas star field + 3D card tilt ────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initStars();
    }

    class Star {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.5 + 0.5;
        this.baseA = Math.random() * 0.7 + 0.3;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.015 + 0.005;
        this.a = this.baseA;
      }
      update(t) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0 && d < 130) {
          const f = (130 - d) / 130;
          this.vx -= (dx / d) * f * 0.12;
          this.vy -= (dy / d) * f * 0.12;
        }

        this.vx *= 0.995;
        this.vy *= 0.995;
        if (Math.abs(this.vx) < 0.05) this.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(this.vy) < 0.05) this.vy += (Math.random() - 0.5) * 0.04;

        this.a = this.baseA * (0.5 + 0.5 * Math.sin(t * this.speed + this.phase));
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,225,255,${this.a})`;
        ctx.fill();
      }
    }

    function initStars() {
      const n = Math.min(Math.floor((w * h) / 10000), 150);
      particlesRef.current = Array.from({ length: n }, () => new Star());
    }

    function drawConnections() {
      const s = particlesRef.current;
      for (let a = 0; a < s.length; a++) {
        for (let b = a + 1; b < s.length; b++) {
          const dx = s[a].x - s[b].x;
          const dy = s[a].y - s[b].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 8100) {
            ctx.strokeStyle = `rgba(0,255,213,${(1 - d2 / 8100) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(s[a].x, s[a].y);
            ctx.lineTo(s[b].x, s[b].y);
            ctx.stroke();
          }
        }
      }
    }

    let t = 0;
    function loop() {
      t++;
      ctx.fillStyle = 'rgba(3,0,20,0.2)';
      ctx.fillRect(0, 0, w, h);
      for (const p of particlesRef.current) {
        p.update(t);
        p.draw();
      }
      drawConnections();
      animRef.current = requestAnimationFrame(loop);
    }

    function onPointer(e) {
      const cx = e.clientX ?? e.touches?.[0]?.clientX;
      const cy = e.clientY ?? e.touches?.[0]?.clientY;
      if (cx == null) return;
      mouseRef.current = { x: cx, y: cy };

      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const ry = Math.max(-15, Math.min(15, ((cx - rect.left - rect.width / 2) / (rect.width / 2)) * 10));
      const rx = Math.max(-15, Math.min(15, -((cy - rect.top - rect.height / 2) / (rect.height / 2)) * 10));
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;

      const g = glareRef.current;
      if (g) {
        const gx = ((cx - rect.left) / rect.width) * 100;
        const gy = ((cy - rect.top) / rect.height) * 100;
        g.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 55%)`;
      }
    }

    function onLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
      if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      if (glareRef.current) glareRef.current.style.background = 'none';
    }

    resize();
    loop();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onPointer);
    window.addEventListener('touchmove', onPointer, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onPointer);
      window.removeEventListener('touchmove', onPointer);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  function fmtUptime(s) {
    if (s == null) return '---';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  }

  const ok = systemData?.status === 'operational';

  return (
    <div style={{
      position: 'relative', width: '100vw', minHeight: '100dvh',
      background: '#030014', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '30px 0', boxSizing: 'border-box', overflowX: 'hidden',
      fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif', color: '#ccd6f6',
    }}>
      {/* Star field — fixed so it stays behind even when page scrolls */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }} />

      {/* Confetti overlay */}
      <canvas ref={celebrateCanvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999, pointerEvents: 'none' }} />

      {/* Central card */}
      <div ref={cardRef} style={{
        position: 'relative', zIndex: 10, width: 'min(520px, 90vw)',
        borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(10,15,30,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 0 120px rgba(0,255,213,0.07), 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        padding: 'clamp(24px, 4vw, 36px)',
        transition: 'opacity 0.8s ease, transform 0.3s ease',
        opacity: mounted ? 1 : 0,
        transformStyle: 'preserve-3d', willChange: 'transform',
      }}>
        <div ref={glareRef} style={{ position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none', zIndex: 100 }} />

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{
            margin: 0, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 700, letterSpacing: 2,
            background: 'linear-gradient(135deg, #fff 0%, #00ffd5 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>MISSION ACCOMPLISHED</h1>

          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 1.5, padding: '4px 10px', borderRadius: 6,
            border: `1px solid ${ok ? '#00ffb4' : '#ffc800'}`,
            color: ok ? '#00ffb4' : '#ffc800',
            background: ok ? 'rgba(0,255,180,0.1)' : 'rgba(255,200,0,0.1)',
            whiteSpace: 'nowrap',
          }}>{systemData?.status?.toUpperCase() || 'CONNECTING...'}</span>
        </div>

        <p style={{ margin: '8px 0 0', fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', color: '#8892b0', letterSpacing: 0.5 }}>
          Coolify &times; VPS &times; CI/CD Pipeline &mdash; <span style={{ color: '#00ffd5' }}>by Jean-Noel @ 2026</span>
        </p>

        {/* ── Divider ────────────────────────────────────────────── */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,255,213,0.3), transparent)', margin: '18px 0' }} />

        {/* ── Stats grid ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { l: 'UPTIME', v: fmtUptime(displayUptime) },
            { l: 'LATENCY', v: pingMs != null ? (pingMs < 0 ? 'ERR' : `${pingMs}ms`) : '---' },
            { l: 'VERSION', v: systemData?.version || '---' },
            { l: 'PYTHON', v: systemData?.python_version || '---' },
          ].map(({ l, v }) => (
            <div key={l} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono), monospace', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontWeight: 600, color: '#e6f1ff',
              }}>{v}</div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#5a6a8a', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ── Stack badges ───────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {(systemData?.stack || ['FastAPI', 'Next.js', 'Docker', 'Coolify', 'GitHub Actions']).map(tech => (
            <span key={tech} style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 20,
              background: 'rgba(0,255,213,0.08)', color: '#00ffd5',
              border: '1px solid rgba(0,255,213,0.15)', letterSpacing: 0.5,
            }}>{tech}</span>
          ))}
        </div>

        {/* ── Terminal ───────────────────────────────────────────── */}
        <div style={{
          marginTop: 18, background: 'rgba(0,0,0,0.4)', borderRadius: 10,
          padding: '14px 16px', border: '1px solid rgba(255,255,255,0.04)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 'clamp(0.65rem, 1.2vw, 0.78rem)', lineHeight: 1.7,
          maxHeight: 'clamp(120px, 22vh, 220px)', overflowY: 'auto',
        }}>
          {visibleLogs.map((line, i) => (
            <div key={i} style={{
              color: line.includes('\u2713') ? '#00ffb4'
                : line.includes('\uD83D\uDE80') ? '#ffd700'
                : line.startsWith('$') ? '#ccd6f6'
                : '#5a6a8a',
            }}>{line || '\u00A0'}</div>
          ))}
          {visibleLogs.length < DEPLOY_LOG.length && (
            <span style={{ color: '#00ffd5', animation: 'blink 1s step-end infinite' }}>{'\u2588'}</span>
          )}
        </div>

        {/* ── Ping button ────────────────────────────────────────── */}
        <button
          onClick={handlePing}
          disabled={pinging}
          onMouseEnter={() => setHoverPing(true)}
          onMouseLeave={() => setHoverPing(false)}
          style={{
            marginTop: 18, width: '100%', padding: '12px 20px', borderRadius: 10,
            border: '1px solid rgba(0,255,213,0.3)',
            background: hoverPing && !pinging ? 'rgba(0,255,213,0.15)' : 'rgba(0,255,213,0.06)',
            color: pinging ? '#5a6a8a' : '#00ffd5',
            fontFamily: 'var(--font-mono), monospace', fontSize: 14, fontWeight: 600,
            letterSpacing: 2, cursor: pinging ? 'wait' : 'pointer',
            transition: 'all 0.2s ease', outline: 'none',
          }}
        >{pinging ? 'PINGING...' : '\u26A1 PING BACKEND'}</button>

        {/* ── Celebrate button ─────────────────────────────────────── */}
        <button
          onClick={handleCelebrate}
          disabled={celebrating}
          onMouseEnter={() => setHoverCelebrate(true)}
          onMouseLeave={() => setHoverCelebrate(false)}
          style={{
            marginTop: 10, width: '100%', padding: '12px 20px', borderRadius: 10,
            border: '1px solid rgba(255,215,0,0.3)',
            background: celebrating
              ? 'rgba(255,215,0,0.2)'
              : hoverCelebrate
                ? 'rgba(255,215,0,0.15)'
                : 'rgba(255,215,0,0.06)',
            color: celebrating ? '#b8960f' : '#ffd700',
            fontFamily: 'var(--font-mono), monospace', fontSize: 14, fontWeight: 600,
            letterSpacing: 2, cursor: celebrating ? 'default' : 'pointer',
            transition: 'all 0.2s ease', outline: 'none',
          }}
        >{celebrating ? '\uD83C\uDF89 CELEBRATING...' : '\uD83C\uDF8A CELEBRATE'}</button>
      </div>

      {/* Bottom hint — in document flow so it's always visible */}
      <div style={{
        marginTop: 20, flexShrink: 0,
        fontFamily: 'var(--font-mono), monospace', fontSize: 12,
        color: 'rgba(255,255,255,0.25)', letterSpacing: 2, zIndex: 10,
        textAlign: 'center',
      }}>[ MOVE CURSOR TO INTERACT ]</div>

      <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>
    </div>
  );
}
