'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DoctorCard from '@/components/patient/DoctorCard';
import { Doctor } from '@/lib/types';
import { Search, SlidersHorizontal } from 'lucide-react';

const SPECIALTIES = ['All','General Physician','Dermatologist','Pediatrician','Orthopedic','Gynecologist','Cardiologist','Neurologist','Dentist'];

function DoctorsContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState('All');
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const sp = searchParams.get('specialty');
    if (sp) setSpecialty(sp);
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const url = specialty && specialty !== 'All' ? `/api/doctors?specialty=${encodeURIComponent(specialty)}` : '/api/doctors';
    fetch(url).then(r => r.json()).then(d => { setDoctors(d); setLoading(false); });
  }, [specialty]);

  const filtered = doctors.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
        <p className="text-gray-500 mt-1">Browse our network of verified doctors</p>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            placeholder="Search by name or specialty..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {SPECIALTIES.map(s => (
          <button key={s} onClick={() => setSpecialty(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${specialty === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
            {s}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No doctors found</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function DoctorsPage() {
  return <Suspense fallback={<div className="p-20 text-center text-gray-400">Loading...</div>}><DoctorsContent /></Suspense>;
}
