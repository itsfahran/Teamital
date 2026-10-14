import { SITE } from './config';
import { LEAD_SETTINGS, LEAD_SETTINGS_KEY } from '@/content/lead-settings';
import { getSiteContent } from './content/server';
import { button, card, detailRow, esc, getSettings, sendEmail, shell } from './booking';

export type Lead = {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  page_path?: string | null;
  form_name?: string | null;
  created_at?: string;
};

/** Everyone who should be emailed when a lead comes in. */
export async function leadRecipients(): Promise<string[]> {
  const c = await getSiteContent(LEAD_SETTINGS_KEY, LEAD_SETTINGS);
  const booking = await getSettings();
  const valid = (x?: string | null) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((x ?? '').trim());
  const main = [c.notifyEmail, booking.host_email, SITE.contactEmail].find(valid) as string;
  return [...new Set([main.trim(), ...c.extraRecipients.filter(valid).map((x) => x.trim())])];
}

export function leadEmailHtml(lead: Lead) {
  const row = (k: string, v?: string | null) => (v ? detailRow(k, esc(v)) : '');
  return shell({
    preheader: `${lead.name} sent a new lead`,
    title: 'New lead received',
    intro: `<b style="color:#fff">${esc(lead.name)}</b> submitted the form${lead.form_name ? ` “${esc(lead.form_name)}”` : ''}${lead.page_path ? ` on <b style="color:#fff">${esc(lead.page_path)}</b>` : ''}.`,
    body: `${card(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Name', lead.name)}${detailRow('Email', `<a href="mailto:${esc(lead.email)}" style="color:#1a56db;text-decoration:none">${esc(lead.email)}</a>`)}${row('Phone', lead.phone)}${row('Company', lead.company)}${row('Page', lead.page_path)}</table>`,
    )}
${lead.message ? `<div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;font-weight:700">Message</div><div style="margin:6px 0 22px;white-space:pre-wrap;background:#f8fafc;border:1px solid #e5eaf3;border-radius:12px;padding:14px 16px;font-size:14px">${esc(lead.message)}</div>` : ''}
<div style="text-align:center">${button(`${SITE.publicSiteUrl}/admin/leads`, 'Open in the admin')}</div>
<p style="margin:22px 0 0;font-size:13px;color:#6b7280;text-align:center">Reply to this email to answer ${esc(lead.name)} directly.</p>`,
  });
}

export async function sendLeadEmail(lead: Lead): Promise<boolean> {
  const c = await getSiteContent(LEAD_SETTINGS_KEY, LEAD_SETTINGS);
  const to = await leadRecipients();
  return sendEmail(to, `${c.subjectPrefix}: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`, leadEmailHtml(lead), lead.email);
}
