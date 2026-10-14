'use client';

import { useRef, useState } from 'react';
import { uploadImage } from './upload';

/** Image URL field with preview, upload to Supabase storage, and a manual URL box. */
export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className="cx-img">
      <div className="cx-img-prev">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" />
        ) : (
          <span className="mi">image</span>
        )}
      </div>
      <div className="cx-img-side">
        <input className="adm-input" value={value} placeholder="https://… or upload" onChange={(e) => onChange(e.target.value)} />
        <div className="cx-img-btns">
          <button type="button" className="adm-btn" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          </button>
          {value && (
            <button type="button" className="adm-btn adm-btn-danger" onClick={() => onChange('')}>
              Remove
            </button>
          )}
        </div>
        {err && <div className="adm-alert adm-alert-err">{err}</div>}
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    </div>
  );
}
