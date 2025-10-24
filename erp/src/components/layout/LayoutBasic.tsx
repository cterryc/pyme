// import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router';

export default function LayoutBasic() {
  // const [searchParams] = useSearchParams();
  // const token = searchParams.get('token');

  // useEffect(() => {
  //   if (token) {
  //     localStorage.setItem('token', token);
  //     window.history.replaceState({}, '', window.location.pathname);
  //   }
  // }, [token]);

  return (
    <div className="min-h-screen">
      <Outlet />
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
