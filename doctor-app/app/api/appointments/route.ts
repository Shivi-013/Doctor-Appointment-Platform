import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { readData, writeData } from '@/lib/data';
import { getTokenPayload } from '@/lib/auth';
import { Appointment, Doctor, User } from '@/lib/types';

export async function GET(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const all = readData<Appointment>('appointments.json');
  if (payload.role === 'admin') return NextResponse.json(all);
  if (payload.role === 'patient') return NextResponse.json(all.filter(a => a.userId === payload.id));
  if (payload.role === 'doctor') {
    const users = readData<User>('users.json');
    const docUser = users.find(u => u.id === payload.id);
    if (!docUser?.doctorId) return NextResponse.json([]);
    return NextResponse.json(all.filter(a => a.doctorId === docUser.doctorId));
  }
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { doctorId, date, time } = await req.json();
  const doctors = readData<Doctor>('doctors.json');
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

  const all = readData<Appointment>('appointments.json');
  const conflict = all.find(a => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'cancelled');
  if (conflict) return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });

  const users = readData<User>('users.json');
  const user = users.find(u => u.id === payload.id);

  const appt: Appointment = {
    id: uuid(),
    userId: payload.id,
    doctorId,
    doctorName: doctor.name,
    doctorSpecialty: doctor.specialty,
    doctorImage: doctor.image,
    patientName: user?.name || 'Patient',
    patientEmail: payload.email,
    date, time,
    fee: doctor.fee,
    status: 'confirmed',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  };
  all.push(appt);
  writeData('appointments.json', all);
  return NextResponse.json(appt, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, paymentStatus } = await req.json();
  const all = readData<Appointment>('appointments.json');
  const idx = all.findIndex(a => a.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (status) all[idx].status = status;
  if (paymentStatus) all[idx].paymentStatus = paymentStatus;
  writeData('appointments.json', all);
  return NextResponse.json(all[idx]);
}
