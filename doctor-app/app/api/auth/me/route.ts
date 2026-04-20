import { NextRequest, NextResponse } from 'next/server';
import { getTokenPayload } from '@/lib/auth';
import { readData, writeData } from '@/lib/data';
import { User } from '@/lib/types';

export async function GET(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (payload.role === 'admin')
    return NextResponse.json({ id: 'admin', name: 'Admin', email: payload.email, role: 'admin' });

  const users = readData<User>('users.json');
  const user = users.find(u => u.id === payload.id);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { password: _, ...safe } = user;
  return NextResponse.json(safe);
}

export async function PUT(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const users = readData<User>('users.json');
  const idx = users.findIndex(u => u.id === payload.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { password: _p, id: _i, role: _r, ...allowed } = body;
  users[idx] = { ...users[idx], ...allowed };
  writeData('users.json', users);

  const { password: __, ...safe } = users[idx];
  return NextResponse.json(safe);
}
