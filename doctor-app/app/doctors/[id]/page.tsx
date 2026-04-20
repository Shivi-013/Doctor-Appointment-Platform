'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Clock, IndianRupee, MapPin, GraduationCap, ChevronLeft, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Doctor } from '@/lib/types';

const TIMES = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM'];
const INITIALS_BG = ['bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500','bg-pink-500','bg-teal-500'];

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/doctors?id=${id}`).then(r => r.json()).then(setDoctor);
    const days = getNext7Days();
    setSelectedDate(formatDate(days[0]));
  }, [id]);

  const idx = parseInt((id || '0').replace(/\D/g, '')) - 1;
  const bgColor = INITIALS_BG[idx % 6] || 'bg-blue-500';
  const initials = doctor?.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0,2).toUpperCase() || '';

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) { setError('Please select a date and time.'); return; }
    setBooking(true); setError('');
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId: id, date: selectedDate, time: selectedTime }),
    });
    setBooking(false);
    if (res.status === 401) { router.push('/login'); return; }
    if (res.ok) { setSuccess(true); }
    else { const d = await res.json(); setError(d.error || 'Booking failed.'); }
  };

  if (!doctor) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
      <p className="text-gray-500 mb-2">Your appointment with <strong>{doctor.name}</strong> is booked for</p>
      <p className="text-blue-600 font-semibold text-lg mb-8">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })} at {selectedTime}</p>
      <div className="flex gap-3 justify-center">
        <Link href="/appointments" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700">View Appointments</Link>
        <Link href="/doctors" className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50">More Doctors</Link>
      </div>
    </div>
  );

  const days = getNext7Days();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/doctors" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft className="w-4 h-4" />Back to Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Doctor info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex gap-5 items-start">
              <div className={`${bgColor} w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{doctor.rating} Rating</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{doctor.experience} Years Exp</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" />₹{doctor.fee} / Visit</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />{doctor.address.line1}, {doctor.address.line2}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">About Doctor</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{doctor.about}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-600" />Education</h2>
            <p className="text-gray-600 text-sm">{doctor.education}</p>
          </div>
        </div>

        {/* Right: Booking */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" />Book Appointment</h2>

          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Select Date</p>
          <div className="grid grid-cols-4 gap-1.5 mb-6">
            {days.map(d => {
              const val = formatDate(d);
              const isSelected = selectedDate === val;
              return (
                <button key={val} onClick={() => setSelectedDate(val)}
                  className={`rounded-lg p-2 text-center transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}>
                  <div className="text-xs">{d.toLocaleDateString('en',{weekday:'short'})}</div>
                  <div className="text-sm font-semibold">{d.getDate()}</div>
                </button>
              );
            })}
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Select Time</p>
          <div className="grid grid-cols-2 gap-1.5 mb-6">
            {TIMES.map(t => (
              <button key={t} onClick={() => setSelectedTime(t)}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${selectedTime === t ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <div className="border-t border-gray-100 pt-4 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Consultation fee</span>
              <span className="font-semibold">₹{doctor.fee}</span>
            </div>
          </div>

          <button onClick={handleBook} disabled={booking}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors">
            {booking ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}
