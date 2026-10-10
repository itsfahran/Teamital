import { MessagesList, type Message } from '@/components/admin/MessagesList';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function MessagesPage() {
  const db = await createServerSupabase();
  const { data, error } = await db
    .from('contact_messages')
    .select('id,name,email,company,message,source,is_read,created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  return (
    <>
      <h1 className="adm-h1">Messages</h1>
      <p className="adm-muted">Submissions from the website contact form.</p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <MessagesList messages={(data ?? []) as Message[]} />
    </>
  );
}
