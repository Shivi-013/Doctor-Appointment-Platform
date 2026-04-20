'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, CheckCircle, XCircle } from 'lucide-react';
import { Appointment } from '@/lib/types';

const statusColor: Record<string,string> = {
  confirmed:'bg-green-100 text-green-700',
  pending:'bg-yellow-100 text-yellow-700',
  cancelled:'bg-red-100 text-red-600',
  completed:'bg-blue-100 text-blue-700',
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
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

  const filtered = appointments.filter(a => {
    const matchSearch = !search || a.patientName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">{appointments.length} total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent" placeholder="Search patient..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','confirmed','completed','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize border transition-colors ${filter === f ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Patient','Email','Date','Time','Fee','Payment','Status','Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{a.patientName}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{a.patientEmail}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{new Date(a.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{a.time}</td>
                    <td className="py-3 px-4 text-gray-600">₹{a.fee}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${a.paymentStatus==='paid'?'bg-green-100 text-green-700':'bg-orange-100 text-orange-600'}`}>{a.paymentStatus}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[a.status]}`}>{a.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      {a.status === 'confirmed' && (
                        <div className="flex gap-1.5">
                          <button onClick={() => update(a.id,'completed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Complete"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => update(a.id,'cancelled')} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel"><XCircle className="w-4 h-4" /></button>
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
