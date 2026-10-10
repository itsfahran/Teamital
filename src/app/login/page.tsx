import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: { absolute: 'Admin sign in | Teamital' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="adm-login">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
