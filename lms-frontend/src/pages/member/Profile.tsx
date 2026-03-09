import { Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function Profile() {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold text-slate-600">Settings &gt; User Profile</div>

      <Card className="mb-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 sm:h-24 sm:w-24" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">Hari Sankar</h1>
              <p className="mt-1 text-xs font-semibold text-slate-500">User ID: LE-2021-9402</p>
              <p className="mt-6 max-w-xl text-sm italic text-slate-500">"Avid reader of speculative fiction and historical biographies. Librarian's Choice award recipient 2023."</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Joined</p>
              <p className="text-sm font-semibold text-slate-700">May 14, 2021</p>
            </div>
          </div>

          <Button>Edit Profile</Button>
        </div>
      </Card>

      <Card className="max-w-full p-5 sm:max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-4xl">Contact Details</h2>
        <p className="mb-5 text-sm text-slate-500">How the library reaches you.</p>

        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500"><Mail size={16} /></div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Registered Email</p>
              <p className="font-semibold text-slate-800">hari.sankar@domain.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500"><Phone size={16} /></div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Contact Number</p>
              <p className="font-semibold text-slate-800">+91 98450 12345</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
