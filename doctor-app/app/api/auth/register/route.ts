import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { readData, writeData } from '@/lib/data';
import { signToken } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const users = readData<User>('users.json');
    if (users.find(u => u.email === email))
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: uuid(), name, email,
      password: hashed,
      role: 'patient',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeData('users.json', users);

    const token = signToken({ id: newUser.id, email: newUser.email, role: 'patient' });
    const res = NextResponse.json({ success: true, role: 'patient' });
    res.cookies.set('token', token, { httpOnly: true, maxAge: 604800, path: '/' });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
