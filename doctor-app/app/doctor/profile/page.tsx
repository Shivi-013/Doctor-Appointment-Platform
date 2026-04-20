'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Stethoscope } from 'lucide-react';

const SPECIALTIES = ['General Physician','Dermatologist','Pediatrician','Orthopedic','Gynecologist','Cardiologist','Neurologist','Dentist'];

export default function DoctorProfile() {
  const [user, setUser] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) { router.push('/login'); return null; } return r.json(); })
      .then(async u => {
        if (!u) return;
        setUser(u);
        if (u.doctorId) {
          const d = await fetch(`/api/doctors?id=${u.doctorId}`).then(r => r.json());
          setDoctor(d);
          setForm({ name:d.name, specialty:d.specialty, experience:d.experience, fee:d.fee, about:d.about, education:d.education, available:d.available, address:d.address });
        }
        setLoading(false);
      });
  }, [router]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    setSaving(true);
    await fetch('/api/doctors', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:doctor.id, ...form, experience:Number(form.experience), fee:Number(form.fee) }) });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  if (!doctor) return (
    <div className="text-center py-20">
      <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">No doctor profile linked to your account.</p>
      <p className="text-sm text-gray-400 mt-1">Please ask the admin to link your account.</p>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-green-600 px-6 py-8 flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{form.name}</h2>
            <p className="text-teal-100 text-sm">{form.specialty}</p>
          </div>
        </div>
        <form onSubmit={save} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input required value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialty</label>
              <select value={form.specialty||''} onChange={e=>setForm({...form,specialty:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500">
                {SPECIALTIES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience (years)</label>
              <input type="number" min={0} value={form.experience||''} onChange={e=>setForm({...form,experience:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Consultation Fee (₹)</label>
              <input type="number" min={100} value={form.fee||''} onChange={e=>setForm({...form,fee:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 1</label>
              <input value={form.address?.line1||''} onChange={e=>setForm({...form,address:{...form.address,line1:e.target.value}})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Line 2</label>
              <input value={form.address?.line2||''} onChange={e=>setForm({...form,address:{...form.address,line2:e.target.value}})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Education</label>
              <input value={form.education||''} onChange={e=>setForm({...form,education:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">About</label>
              <textarea rows={4} value={form.about||''} onChange={e=>setForm({...form,about:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-500 resize-none" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="avail" checked={form.available||false} onChange={e=>setForm({...form,available:e.target.checked})} className="rounded w-4 h-4" />
              <label htmlFor="avail" className="text-sm text-gray-700">Available for new appointments</label>
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
