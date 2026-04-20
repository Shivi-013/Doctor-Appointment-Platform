import Link from 'next/link';
import { Star, Clock, IndianRupee } from 'lucide-react';
import { Doctor } from '@/lib/types';

const COLORS = ['bg-blue-100 text-blue-700','bg-purple-100 text-purple-700','bg-green-100 text-green-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700','bg-teal-100 text-teal-700'];
const INITIALS_BG = ['bg-blue-500','bg-purple-500','bg-green-500','bg-orange-500','bg-pink-500','bg-teal-500'];

function docIdx(id: string) {
  const n = id.replace(/\D/g, '');
  return (parseInt(n || '0') - 1) % 6;
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const idx = docIdx(doctor.id);
  const initials = doctor.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <Link href={`/doctors/${doctor.id}`} className="group block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-200 overflow-hidden">
      <div className={`${INITIALS_BG[idx]} h-40 flex items-center justify-center`}>
        <span className="text-4xl font-bold text-white">{initials}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${COLORS[idx]}`}>{doctor.specialty}</span>
          {doctor.available && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">Available</span>}
        </div>
        <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{doctor.rating}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{doctor.experience} yrs</span>
          <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{doctor.fee}</span>
        </div>
      </div>
    </Link>
  );
}
