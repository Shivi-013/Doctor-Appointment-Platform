'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Users, Calendar, IndianRupee, Clock } from 'lucide-react';
import { Appointment } from '@/lib/types';

interface Stats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  revenue: number;
  recentAppointments: Appointment[];
}

const statusColor: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => {
      if (!r.ok) { router.push('/login'); return null; }
      return r.json();
    }).then(d => d && setStats(d));
  }, [router]);

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  const cards = [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: Stethoscope, color: 'bg-blue-500' },
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'bg-purple-500' },
    { label: 'Appointments', value: stats.totalAppointments, icon: Calendar, color: 'bg-green-500' },
    { label: 'Revenue (Paid)', value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" />Recent Appointments</h2>
        {stats.recentAppointments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No appointments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Patient','Doctor','Date','Time','Fee','Status'].map(h => <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{a.patientName}</td>
                    <td className="py-3 px-2 text-gray-600">{a.doctorName}</td>
                    <td className="py-3 px-2 text-gray-600">{new Date(a.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                    <td className="py-3 px-2 text-gray-600">{a.time}</td>
                    <td className="py-3 px-2 text-gray-600">₹{a.fee}</td>
                    <td className="py-3 px-2"><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[a.status]}`}>{a.status}</span></td>
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
