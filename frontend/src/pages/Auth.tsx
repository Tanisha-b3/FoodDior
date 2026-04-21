import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, loginUser } from '../store/slices/userSlice';
import { Eye, EyeOff, ArrowRight, Loader2, X } from 'lucide-react';

interface AuthDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AuthDialog({ isOpen = true, onClose = () => {} }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'donor',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
      } else {
        await dispatch(registerUser(form)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const switchTab = (tab: 'login' | 'signup') => {
    setIsLogin(tab === 'login');
    setForm({ name: '', email: '', phone: '', password: '', role: 'donor' });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-2000 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-stone-100 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#5a8a2a] font-bold text-lg">🌿 ZeroHunger</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-stone-100 rounded-xl p-1 gap-1 max-w-[220px] mx-auto">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isLogin ? 'bg-[#2d1f1a] text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => switchTab('signup')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isLogin ? 'bg-[#2d1f1a] text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1.5">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name" required={!isLogin}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 text-sm outline-none focus:bg-white focus:border-[#9CCC65] focus:ring-2 focus:ring-[#9CCC65]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1.5">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210" required={!isLogin}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 text-sm outline-none focus:bg-white focus:border-[#9CCC65] focus:ring-2 focus:ring-[#9CCC65]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1.5">I want to</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-sm outline-none focus:bg-white focus:border-[#9CCC65] focus:ring-2 focus:ring-[#9CCC65]/20"
                  >
                    <option value="donor">Donate Food</option>
                    <option value="receiver">Receive Food</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com" required
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 text-sm outline-none focus:bg-white focus:border-[#9CCC65] focus:ring-2 focus:ring-[#9CCC65]/20"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold tracking-widest uppercase text-stone-500">Password</label>
                {isLogin && <button type="button" className="text-xs text-[#5a8a2a] hover:underline">Forgot password?</button>}
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password" required
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder:text-stone-400 text-sm outline-none focus:bg-white focus:border-[#9CCC65] focus:ring-2 focus:ring-[#9CCC65]/20 pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-[#2d1f1a] text-white hover:bg-[#3d2a22] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{isLogin ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-stone-400 text-xs mt-4">
            By continuing, you agree to our{' '}
            <span className="text-[#5a8a2a] cursor-pointer hover:underline">Terms</span>{' '}
            &amp;{' '}
            <span className="text-[#5a8a2a] cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
