export type Role = 'patient' | 'admin' | 'doctor';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  fee: number;
  rating: number;
  available: boolean;
  image: string;
  about: string;
  education: string;
  address: { line1: string; line2: string };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  gender?: string;
  dob?: string;
  image?: string;
  role: Role;
  doctorId?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  fee: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
}

export type SafeUser = Omit<User, 'password'>;
