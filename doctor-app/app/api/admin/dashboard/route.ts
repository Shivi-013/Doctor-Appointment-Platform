import { NextRequest, NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { getTokenPayload } from '@/lib/auth';
import { Appointment, Doctor, User } from '@/lib/types';

export async function GET(req: NextRequest) {
  const payload = getTokenPayload(req);
  if (!payload || payload.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const doctors = readData<Doctor>('doctors.json');
  const users = readData<User>('users.json');
  const appointments = readData<Appointment>('appointments.json');
  const patients = users.filter(u => u.role === 'patient');
  const revenue = appointments.filter(a => a.paymentStatus === 'paid').reduce((s, a) => s + a.fee, 0);

  return NextResponse.json({
    totalDoctors: doctors.length,
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    revenue,
    recentAppointments: [...appointments].reverse().slice(0, 6),
  });
}
