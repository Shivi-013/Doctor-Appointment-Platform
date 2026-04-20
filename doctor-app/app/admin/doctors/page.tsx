'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import { Doctor } from '@/lib/types';

const SPECIALTIES = ['General Physician','Dermatologist','Pediatrician','Orthopedic','Gynecologist','Cardiologist','Neurologist','Dentist'];
const INITIALS_BG = ['bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500','bg-pink-500','bg-teal-500'];

const empty = { name:'', specialty:'General Physician', experience:1, fee:500, rating:4.5, available:true, about:'', education:'', address:{ line1:'', line2:'' } };

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const load = () => {
    fetch('/api/doctors').then(r => { if (!r.ok) { router.push('/login'); return null; } return r.json(); })
      .then(d => { if (d) setDoctors(d); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (d: Doctor) => { setEditing(d); setForm({ ...d }); setShowForm(true); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, experience: Number(form.experience), fee: Number(form.fee), rating: Number(form.rating) };
    if (editing) {
      await fetch('/api/doctors', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:editing.id, ...payload }) });
    } else {
      await fetch('/api/doctors', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ ...payload, image:'' }) });
    }
    setSaving(false); setShowForm(false); load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this doctor?')) return;
    await fetch('/api/doctors', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id }) });
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-500 text-sm mt-1">{doctors.length} doctors registered</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" />Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {doctors.map((d, i) => {
          const bg = INITIALS_BG[parseInt(d.id.replace(/\D/g,''))-1 % 6] || INITIALS_BG[i % 6];
          const initials = d.name.split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase();
          return (
            <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`${bg} h-24 flex items-center justify-center`}>
                <span className="text-3xl font-bold text-white">{initials}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <p className="text-sm text-blue-600">{d.specialty}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(d)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => del(d.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{d.rating}</span>
                  <span>{d.experience} yrs exp</span>
                  <span>₹{d.fee}/visit</span>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${d.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{d.available ? 'Available' : 'Unavailable'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editing ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Specialty</label>
                  <select value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500">
                    {SPECIALTIES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Experience (yrs)</label>
                  <input type="number" min={1} required value={form.experience} onChange={e=>setForm({...form,experience:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fee (₹)</label>
                  <input type="number" min={100} required value={form.fee} onChange={e=>setForm({...form,fee:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                  <input type="number" step="0.1" min={1} max={5} required value={form.rating} onChange={e=>setForm({...form,rating:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Address Line 1</label>
                  <input required value={form.address.line1} onChange={e=>setForm({...form,address:{...form.address,line1:e.target.value}})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Address Line 2</label>
                  <input required value={form.address.line2} onChange={e=>setForm({...form,address:{...form.address,line2:e.target.value}})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Education</label>
                  <input required value={form.education} onChange={e=>setForm({...form,education:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">About</label>
                  <textarea rows={3} required value={form.about} onChange={e=>setForm({...form,about:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="avail" checked={form.available} onChange={e=>setForm({...form,available:e.target.checked})} className="rounded" />
                  <label htmlFor="avail" className="text-sm text-gray-700">Available for appointments</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
                  <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
