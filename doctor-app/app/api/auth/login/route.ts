import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readData } from '@/lib/data';
import { signToken } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    if (email === (process.env.ADMIN_EMAIL || 'admin@docapp.com') &&
        password === (process.env.ADMIN_PASSWORD || 'Admin@1234')) {
      const token = signToken({ id: 'admin', email, role: 'admin' });
      const res = NextResponse.json({ success: true, role: 'admin' });
      res.cookies.set('token', token, { httpOnly: true, maxAge: 604800, path: '/' });
      return res;
    }

    const users = readData<User>('users.json');
    const user = users.find(u => u.email === email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ success: true, role: user.role });
    res.cookies.set('token', token, { httpOnly: true, maxAge: 604800, path: '/' });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
