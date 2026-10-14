import { PageBuilder } from '@/components/admin/builder/PageBuilder';

export default function NewPage() {
  return (
    <>
      <h1 className="adm-h1">New page</h1>
      <p className="adm-muted">Give the page a title, add sections, pick a design for each one and fill in the content. Publish when you are happy.</p>
      <PageBuilder initial={null} />
    </>
  );
}
