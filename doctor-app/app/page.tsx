'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Star, Clock, Shield, HeartPulse, ChevronRight, IndianRupee } from 'lucide-react';
import DoctorCard from '@/components/patient/DoctorCard';
import { Doctor } from '@/lib/types';

const SPECIALTIES = ['General Physician','Dermatologist','Pediatrician','Orthopedic','Gynecologist','Cardiologist','Neurologist','Dentist'];

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(setDoctors);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Book Doctor Appointments <span className="text-blue-200">Instantly</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8">Connect with top-rated doctors across all specialties. Easy booking, no waiting.</p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  className="flex-1 text-gray-800 placeholder-gray-400 outline-none text-sm"
                  placeholder="Search doctors, specialties..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Link href={`/doctors${search ? `?q=${encodeURIComponent(search)}` : ''}`}
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-center">
                Find Doctors
              </Link>
            </div>
            <div className="flex gap-6 mt-8 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-blue-200" />Top Rated</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" />Verified Doctors</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Instant Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[['50+','Expert Doctors'],['10K+','Happy Patients'],['25+','Specialties'],['4.8★','Average Rating']].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-blue-600">{val}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse by Specialty</h2>
            <p className="text-gray-500 mt-1">Find the right specialist for your needs</p>
          </div>
          <Link href="/doctors" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">View all <ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SPECIALTIES.map((s, i) => {
            const colors = ['blue','purple','green','orange','pink','teal','indigo','red'];
            const c = colors[i % colors.length];
            return (
              <Link key={s} href={`/doctors?specialty=${encodeURIComponent(s)}`}
                className={`bg-${c}-50 hover:bg-${c}-100 border border-${c}-100 rounded-xl p-4 text-center transition-colors group`}>
                <div className={`w-10 h-10 bg-${c}-500 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <p className={`text-sm font-medium text-${c}-800`}>{s}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top Doctors */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Doctors</h2>
              <p className="text-gray-500 mt-1">Trusted by thousands of patients</p>
            </div>
            <Link href="/doctors" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm">See all <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map(d => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to book your appointment?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of patients who trust DocBook for their healthcare needs.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">Get Started Free</Link>
            <Link href="/doctors" className="border border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">Browse Doctors</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
