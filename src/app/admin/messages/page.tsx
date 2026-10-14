import { ADMIN_UI, ADMIN_UI_KEY } from '@/content/admin-ui';
import { getSiteContent } from '@/lib/content/server';
import { MessagesList, type Message } from '@/components/admin/MessagesList';
import { createServerSupabase } from '@/lib/supabase/server';

export default async function MessagesPage() {
  const ui = (await getSiteContent(ADMIN_UI_KEY, ADMIN_UI)).pages.messages;
  const db = await createServerSupabase();
  const { data, error } = await db
    .from('contact_messages')
    .select('id,name,email,company,message,source,is_read,created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  return (
    <>
      <h1 className="adm-h1">{ui.title}</h1>
      <p className="adm-muted">{ui.intro}</p>
      {error && <div className="adm-alert adm-alert-err">{error.message}</div>}
      <MessagesList messages={(data ?? []) as Message[]} />
    </>
  );
}
