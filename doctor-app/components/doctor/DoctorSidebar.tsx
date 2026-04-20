'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, User, LogOut, Stethoscope, Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/doctor/profile', icon: User, label: 'My Profile' },
];

export default function DoctorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const Nav = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">DocBook</div>
            <div className="text-xs text-gray-500">Doctor Panel</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === l.href ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            <l.icon className="w-4 h-4" />{l.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 h-screen sticky top-0">
        <Nav />
      </aside>
      <button onClick={() => setOpen(true)} className="md:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg text-white">
        <Menu className="w-5 h-5" />
      </button>
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="bg-black/40 flex-1" onClick={() => setOpen(false)} />
          <aside className="w-64 bg-white h-full shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1"><X className="w-5 h-5 text-gray-500" /></button>
            <Nav />
          </aside>
        </div>
      )}
    </>
  );
}
