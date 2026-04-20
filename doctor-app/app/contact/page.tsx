'use client';
import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-500 mt-2">We'd love to hear from you. Send us a message and we'll respond soon.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {[[Phone,'+91 98765 43210','Available Mon–Sat, 9am–6pm'],[Mail,'hello@docbook.in','We reply within 24 hours'],[MapPin,'Chennai, Tamil Nadu','Visit our office']].map(([Icon, val, sub]) => (
            <div key={val as string} className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{val as string}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub as string}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {sent ? (
            <div className="text-center py-10">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">Message Sent!</h3>
              <p className="text-gray-500 mt-2">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({name:'',email:'',subject:'',message:''}); }}
                className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[['name','Your Name','text'],['email','Email','email']].map(([f,l,t]) => (
                  <div key={f}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label>
                    <input type={t} required value={(form as any)[f]} onChange={e => setForm({...form,[f]:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input required value={form.subject} onChange={e => setForm({...form,subject:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>
              <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                <Send className="w-4 h-4" />Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
