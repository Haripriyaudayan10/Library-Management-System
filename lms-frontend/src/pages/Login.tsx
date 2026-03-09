import { useState, type FormEvent } from 'react';
import { BookOpenCheck, CircleAlert, Lock, Mail, MoveRight } from 'lucide-react';
import students from '../assets/login-students.png';
import { Button } from '../components/ui/Button';

interface LoginProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function Login({ onSubmit }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="min-h-[calc(100vh-2rem)] overflow-hidden rounded-sm border border-slate-200 bg-[#e2f2ee] shadow-sm">
        <div className="flex h-14 items-center border-b border-emerald-800 bg-emerald-800 px-4 sm:h-16 sm:px-8">
          <div className="flex items-center gap-3 text-white">
            <div className="rounded-md bg-white/10 p-1.5">
              <BookOpenCheck size={16} />
            </div>
            <span className="text-xl font-extrabold tracking-tight sm:text-2xl">READSPHERE</span>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[1.6fr_1fr] lg:gap-5 lg:px-8 lg:py-7">
          <div className="hidden overflow-hidden border border-slate-200 bg-white lg:block">
            <img src={students} alt="Students" className="h-full w-full object-cover" />
          </div>

          <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" onSubmit={handleLogin}>
            <div className="mb-6 text-center">
              <p className="mb-1 inline-flex items-center gap-2 text-emerald-700">
                <BookOpenCheck size={19} />
                <span className="text-2xl font-extrabold sm:text-4xl">READSPHERE</span>
              </p>
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">Welcome Back</h1>
              <p className="mt-1 text-sm text-slate-500">Access your library dashboard securely</p>
            </div>

            <label className="mb-4 block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Email</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-100 pl-10 pr-3 text-sm outline-none ring-emerald-300 transition focus:bg-white focus:ring-2"
                />
              </span>
            </label>

            <label className="mb-6 block">
              <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Password</span>
              </div>
              <span className="relative block">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-100 pl-10 pr-3 text-sm outline-none ring-emerald-300 transition focus:bg-white focus:ring-2"
                />
              </span>
            </label>

            <Button
              className="h-11 w-full rounded-xl bg-emerald-500 text-sm hover:bg-emerald-600"
              type="submit"
              disabled={loading}
            >
              Sign In
              <MoveRight size={15} />
            </Button>

            {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}

            <div className="my-6 border-t border-slate-200" />

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="mb-1 inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CircleAlert size={14} className="text-emerald-700" />
                Single Sign-On Enabled
              </p>
              <p className="text-xs text-slate-500">You will automatically be redirected to your dashboard based on your account role.</p>
            </div>

            <p className="mt-8 text-center text-xs text-slate-500">
              Don't have an account? <span className="font-semibold text-emerald-700">Contact your Librarian</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
