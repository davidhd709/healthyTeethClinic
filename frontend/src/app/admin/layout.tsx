'use client';

import { useEffect, useSyncExternalStore, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import AdminSidebar from '@/components/admin/AdminSidebar';

function subscribeAuthChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => callback();
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

function getAuthSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';
  const token = useSyncExternalStore(subscribeAuthChange, getAuthSnapshot, () => null);
  const isAuth = useMemo(() => Boolean(token), [token]);

  // Hide the main site Navbar and Footer when inside admin routes
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'admin-layout-override';
    style.textContent = `
      body > header,
      body > footer {
        display: none !important;
      }
      body {
        min-height: 100vh !important;
      }
      body > main {
        flex: 1 1 0% !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        height: 100vh !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById('admin-layout-override');
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (!isAuth && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [router, isAuth, isLoginPage]);

  // Login page renders without admin chrome
  if (isLoginPage) {
    return (
      <>
        {children}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Wait for auth check
  if (!isAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Sparkles className="h-6 w-6 animate-pulse text-cyan-500" />
          <span className="text-sm font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-slate-800">
              Panel de Administracion
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
              A
            </div>
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">
              Administrador
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
