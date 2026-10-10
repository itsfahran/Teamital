/** Tells the server to drop cached public pages after an admin edit. */
export async function revalidateSite(): Promise<void> {
  try {
    await fetch('/api/revalidate', { method: 'POST' });
  } catch {
    // Pages also refresh on their own within ~30s.
  }
}
