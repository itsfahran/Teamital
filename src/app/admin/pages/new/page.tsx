import { PageEditor } from '@/components/admin/PageEditor';

export default function NewPage() {
  return (
    <>
      <h1 className="adm-h1">New page</h1>
      <PageEditor initial={null} />
    </>
  );
}
