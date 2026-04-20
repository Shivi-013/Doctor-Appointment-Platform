import Link from 'next/link';
import { Stethoscope, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">DocBook</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Your trusted platform for booking appointments with top doctors across all specialties.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/doctors', 'Find Doctors'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Specialties</h3>
            <ul className="space-y-2 text-sm">
              {['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic'].map(s => (
                <li key={s}><Link href={`/doctors?specialty=${encodeURIComponent(s)}`} className="hover:text-white transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />Chennai, Tamil Nadu</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />+91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />hello@docbook.in</li>
            </ul>
          </div>
        </div>
        <hr className="border-gray-700 my-8" />
        <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} DocBook. All rights reserved.</p>
      </div>
    </footer>
  );
}
