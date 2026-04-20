import DoctorSidebar from '@/components/doctor/DoctorSidebar';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 min-w-0 p-6">{children}</div>
    </div>
  );
}
