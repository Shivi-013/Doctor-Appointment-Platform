'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, IndianRupee, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Appointment } from '@/lib/types';

const statusColor: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
};
const payColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-orange-100 text-orange-600',
};

const INITIALS_BG = ['bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500','bg-pink-500','bg-teal-500'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const router = useRouter();

  const load = () => {
    fetch('/api/appointments').then(r => {
      if (!r.ok) { router.push('/login'); return null; }
      return r.json();
    }).then(d => { if (d) setAppointments([...d].reverse()); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    setCancelling(id);
    await fetch('/api/appointments', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id, status:'cancelled' }) });
    setCancelling(null);
    load();
  };

  const pay = async (id: string) => {
    await fetch('/api/appointments', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id, paymentStatus:'paid' }) });
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Appointments</h1>
      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No appointments yet</p>
          <a href="/doctors" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm">Book Now</a>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a, i) => {
            const idx = parseInt(a.doctorId.replace(/\D/g,'')) - 1;
            const bg = INITIALS_BG[idx % 6];
            const initials = a.doctorName.split(' ').filter(Boolean).map((w:string)=>w[0]).join('').slice(0,2).toUpperCase();
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-4">
                <div className={`${bg} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg font-bold text-white">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{a.doctorName}</h3>
                      <p className="text-sm text-gray-500">{a.doctorSpecialty}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[a.status]}`}>{a.status}</span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${payColor[a.paymentStatus]}`}>{a.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(a.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{a.time}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />₹{a.fee}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {a.status !== 'cancelled' && a.status !== 'completed' && (
                    <>
                      {a.paymentStatus === 'pending' && (
                        <button onClick={() => pay(a.id)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" />Pay
                        </button>
                      )}
                      <button onClick={() => cancel(a.id)} disabled={cancelling === a.id}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                        <XCircle className="w-3.5 h-3.5" />{cancelling === a.id ? '...' : 'Cancel'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
