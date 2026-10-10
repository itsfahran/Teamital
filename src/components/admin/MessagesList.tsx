'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type Message = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string;
  is_read: boolean;
  created_at: string;
};

export function MessagesList({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const shown = filter === 'unread' ? messages.filter((m) => !m.is_read) : messages;

  const setRead = async (m: Message, read: boolean) => {
    await createClient().from('contact_messages').update({ is_read: read }).eq('id', m.id);
    router.refresh();
  };

  const remove = async (m: Message) => {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    await createClient().from('contact_messages').delete().eq('id', m.id);
    router.refresh();
  };

  return (
    <>
      <div className="adm-tabs">
        <button className={filter === 'all' ? 'adm-tab adm-tab-on' : 'adm-tab'} onClick={() => setFilter('all')}>
          All ({messages.length})
        </button>
        <button className={filter === 'unread' ? 'adm-tab adm-tab-on' : 'adm-tab'} onClick={() => setFilter('unread')}>
          Unread ({messages.filter((m) => !m.is_read).length})
        </button>
      </div>
      <div className="adm-card">
        {shown.length === 0 && <div className="adm-empty">Nothing here.</div>}
        {shown.map((m) => {
          const isOpen = open === m.id;
          return (
            <div key={m.id} className={m.is_read ? 'adm-msg' : 'adm-msg adm-msg-new'}>
              <button
                className="adm-msg-head"
                onClick={() => {
                  setOpen(isOpen ? null : m.id);
                  if (!isOpen && !m.is_read) void setRead(m, true);
                }}
              >
                <div>
                  <b>{m.name}</b> <span className="adm-muted">&lt;{m.email}&gt;</span>
                  {m.company && <span className="adm-muted"> · {m.company}</span>}
                  {!m.is_read && <span className="adm-badge">new</span>}
                  {!isOpen && <div className="adm-muted adm-clip">{m.message}</div>}
                </div>
                <div className="adm-muted">{new Date(m.created_at).toLocaleString()}</div>
              </button>
              {isOpen && (
                <div className="adm-msg-body">
                  <p>{m.message}</p>
                  <div className="adm-actions">
                    <a className="adm-btn adm-btn-sm adm-btn-primary" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message to Teamital')}`}>
                      Reply
                    </a>
                    <button className="adm-btn adm-btn-sm" onClick={() => setRead(m, !m.is_read)}>
                      Mark {m.is_read ? 'unread' : 'read'}
                    </button>
                    <button className="adm-btn adm-btn-sm adm-btn-danger" onClick={() => remove(m)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
