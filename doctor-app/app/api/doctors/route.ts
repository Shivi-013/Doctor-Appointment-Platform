import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { readData, writeData } from '@/lib/data';
import { getTokenPayload } from '@/lib/auth';
import { Doctor } from '@/lib/types';

export async function GET(req: NextRequest) {
  const doctors = readData<Doctor>('doctors.json');
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get('specialty');
  const id = searchParams.get('id');

  if (id) {
    const doc = doctors.find(d => d.id === id);
    return doc ? NextResponse.json(doc) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (specialty && specialty !== 'All')
    return NextResponse.json(doctors.filter(d => d.specialty === specialty));
  return NextResponse.json(doctors);
}

export async function POST(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload || payload.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const doctors = readData<Doctor>('doctors.json');
  const newDoc: Doctor = { id: uuid(), ...body };
  doctors.push(newDoc);
  writeData('doctors.json', doctors);
  return NextResponse.json(newDoc, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload || (payload.role !== 'admin' && payload.role !== 'doctor'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, ...updates } = await req.json();
  const doctors = readData<Doctor>('doctors.json');
  const idx = doctors.findIndex(d => d.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  doctors[idx] = { ...doctors[idx], ...updates };
  writeData('doctors.json', doctors);
  return NextResponse.json(doctors[idx]);
}

export async function DELETE(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload || payload.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await req.json();
  const doctors = readData<Doctor>('doctors.json');
  writeData('doctors.json', doctors.filter(d => d.id !== id));
  return NextResponse.json({ success: true });
}
