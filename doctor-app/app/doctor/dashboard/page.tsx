'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle, XCircle, Clock, IndianRupee } from 'lucide-react';
import { Appointment } from '@/lib/types';

const statusColor: Record<string,string> = {
  confirmed:'bg-green-100 text-green-700',
  pending:'bg-yellow-100 text-yellow-700',
  cancelled:'bg-red-100 text-red-600',
  completed:'bg-blue-100 text-blue-700',
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = () => {
    fetch('/api/appointments').then(r => { if (!r.ok) { router.push('/login'); return null; } return r.json(); })
      .then(d => { if (d) setAppointments([...d].reverse()); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    await fetch('/api/appointments', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id, status }) });
    load();
  };

  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'confirmed').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;
  const revenue = appointments.filter(a => a.paymentStatus === 'paid').reduce((s,a) => s + a.fee, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.date === todayStr && a.status !== 'cancelled');

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  const cards = [
    { label: "Today's Appointments", value: todayAppts.length, icon: Calendar, color: 'bg-teal-500' },
    { label: 'Confirmed', value: pending, icon: Clock, color: 'bg-blue-500' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Earnings (Paid)', value: `₹${revenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className={`${c.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />Today's Schedule
          {todayAppts.length > 0 && <span className="ml-auto text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{todayAppts.length} appointments</span>}
        </h2>
        {todayAppts.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No appointments scheduled for today</p>
        ) : (
          <div className="space-y-3">
            {todayAppts.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-700">{a.patientName[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{a.patientName}</p>
                    <p className="text-xs text-gray-500">{a.time} · ₹{a.fee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[a.status]}`}>{a.status}</span>
                  {a.status === 'confirmed' && (
                    <button onClick={() => update(a.id,'completed')}
                      className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Mark complete">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2"><Clock className="w-4 h-4 text-teal-600" />Recent Appointments</h2>
        {appointments.slice(0,8).length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No appointments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Patient','Date','Time','Fee','Payment','Status','Action'].map(h => (
                    <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0,8).map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-2 font-medium text-gray-900">{a.patientName}</td>
                    <td className="py-3 px-2 text-gray-600">{new Date(a.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                    <td className="py-3 px-2 text-gray-600">{a.time}</td>
                    <td className="py-3 px-2 text-gray-600">₹{a.fee}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.paymentStatus==='paid'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-600'}`}>{a.paymentStatus}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="py-3 px-2">
                      {a.status === 'confirmed' && (
                        <div className="flex gap-1">
                          <button onClick={() => update(a.id,'completed')} className="p-1 text-green-600 hover:bg-green-50 rounded-lg" title="Complete"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => update(a.id,'cancelled')} className="p-1 text-red-500 hover:bg-red-50 rounded-lg" title="Cancel"><XCircle className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
