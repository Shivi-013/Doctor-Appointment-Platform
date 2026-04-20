'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Stethoscope, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [dropOpen, setDropOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => d && setUser(d)).catch(() => {});
  }, [pathname]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/doctors', label: 'All Doctors' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">DocBook</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === l.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    {user.role === 'patient' && <>
                      <Link href="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><User className="w-4 h-4" />My Profile</Link>
                      <Link href="/appointments" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Stethoscope className="w-4 h-4" />My Appointments</Link>
                    </>}
                    {user.role === 'admin' && <Link href="/admin/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Panel</Link>}
                    {user.role === 'doctor' && <Link href="/doctor/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Doctor Panel</Link>}
                    <hr className="my-1" />
                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"><LogOut className="w-4 h-4" />Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">Login</Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${pathname === l.href ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              {l.label}
            </Link>
          ))}
          <hr className="my-2" />
          {user ? (
            <>
              {user.role === 'patient' && <><Link href="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">My Profile</Link><Link href="/appointments" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">My Appointments</Link></>}
              {user.role === 'admin' && <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Admin Panel</Link>}
              {user.role === 'doctor' && <Link href="/doctor/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Doctor Panel</Link>}
              <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg">Login</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="flex-1 text-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
