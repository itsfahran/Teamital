'use client';

import { useEffect, useRef, useState } from 'react';

const PHRASES = ['Track attendance.', 'Manage teams.', 'Grow faster.', 'Stay in sync.'];
const COLORS = ['#1A56DB', '#0EA5E9', '#7C3AED', '#059669'];

/** Short cycling typewriter headline with color changes (port of WebTypewriterHeading). */
export function Typewriter({ fontSize = 42 }: { fontSize?: number }) {
  const [phrase, setPhrase] = useState(0);
  const [shown, setShown] = useState('');
  const state = useRef({ phrase: 0, shown: '', deleting: false });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = (ms: number) => {
      timer = setTimeout(tick, ms);
    };
    const tick = () => {
      const s = state.current;
      const full = PHRASES[s.phrase % PHRASES.length];
      if (!s.deleting) {
        if (s.shown.length < full.length) {
          s.shown = full.slice(0, s.shown.length + 1);
          setShown(s.shown);
          schedule(55);
        } else {
          s.deleting = true;
          schedule(1400);
        }
      } else if (s.shown.length > 0) {
        s.shown = s.shown.slice(0, -1);
        setShown(s.shown);
        schedule(28);
      } else {
        s.deleting = false;
        s.phrase += 1;
        setPhrase(s.phrase);
        schedule(320);
      }
    };
    schedule(380);
    return () => clearTimeout(timer);
  }, []);

  const color = COLORS[phrase % COLORS.length];
  return (
    <div className="typewriter" style={{ fontSize }}>
      <span style={{ fontWeight: 800, color }}>{shown === '' ? ' ' : shown}</span>
      <span style={{ fontWeight: 300, color, opacity: 0.55 }}>|</span>
    </div>
  );
}
