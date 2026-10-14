import { createClient } from '@/lib/supabase/client';

/** Uploads an image to the public `cms-media` bucket and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Image is larger than 10 MB.');
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';
  const path = `${new Date().getFullYear()}/${Date.now()}-${base}.${ext}`;
  const sb = createClient();
  const { error } = await sb.storage.from('cms-media').upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return sb.storage.from('cms-media').getPublicUrl(path).data.publicUrl;
}
