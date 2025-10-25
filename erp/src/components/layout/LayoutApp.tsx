// import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Outlet, useSearchParams } from 'react-router';
import { LeftDashboard } from '@/view/LeftDashboard';

export default function LayoutApp() {
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get('token');

  // useEffect(() => {
  //   if (token) {
  //     localStorage.setItem('token', token);
  //     window.history.replaceState({}, '', window.location.pathname);
  //   }
  // }, [token]);

  return (
    <div className="flex min-h-screen">
      <LeftDashboard />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Toaster
        theme="light"
        position="top-center"
        richColors
        closeButton
        visibleToasts={3}
      />
    </div>
  );
}
