import { Shield, HeartPulse, Clock, Users, Award, Stethoscope } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">About DocBook</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">We're on a mission to make quality healthcare accessible to everyone by connecting patients with top doctors instantly.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">DocBook was founded with a simple belief: finding and booking a doctor should be as easy as ordering food online. We saw too many people struggling to get timely medical appointments and decided to change that.</p>
            <p className="text-gray-600 leading-relaxed">Today, we connect thousands of patients with verified, top-rated doctors across multiple specialties — all from the comfort of their home.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['50+','Expert Doctors'],['10K+','Happy Patients'],['25+','Specialties'],['4.8★','Avg Rating']].map(([v,l]) => (
              <div key={l} className="bg-blue-50 rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{v}</div>
                <div className="text-sm text-gray-600 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose DocBook?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              [Shield,'Verified Doctors','All doctors are thoroughly verified and credentialed before listing on our platform.'],
              [Clock,'Instant Booking','Book appointments in seconds — no phone calls, no waiting on hold.'],
              [HeartPulse,'All Specialties','From general physicians to specialists, we cover all your healthcare needs.'],
              [Users,'Patient-First','We put patients at the center of everything we build and every decision we make.'],
              [Award,'Top Rated','Only the highest-rated and most experienced doctors make our network.'],
              [Stethoscope,'Secure & Private','Your health data is encrypted and never shared without your consent.'],
            ].map(([Icon, title, desc]) => (
              <div key={title as string} className="p-6 rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title as string}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
