import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/userSlice';
import { ArrowLeft, User, Mail, Phone, MapPin, Award, Heart, LogOut, Edit2, Save } from 'lucide-react';

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.users);
  const { donations } = useAppSelector((state) => state.donations);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  console.log('Current User:', currentUser);
  console.log('All Donations:', donations);
  const userDonations = donations.filter(
    d => d.name === currentUser?.name || d.phone === currentUser?.phone
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-stone-800">Profile</h1>
            <p className="text-stone-500 text-sm">Manage your account</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-md text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#9CCC65] to-[#8db854] rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="font-bold text-xl text-stone-800">{currentUser?.name}</h2>
              <p className="text-stone-500 text-sm capitalize">{currentUser?.role}</p>
              
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-stone-600 text-sm">
                  <Mail className="w-4 h-4 text-stone-400" />
                  {currentUser?.email}
                </div>
                <div className="flex items-center gap-3 text-stone-600 text-sm">
                  <Phone className="w-4 h-4 text-stone-400" />
                  {currentUser?.phone}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats & Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-md text-center">
                <div className="w-12 h-12 bg-[#9CCC65]/15 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#5a8a2a]" />
                </div>
                <p className="text-2xl font-bold text-stone-800">{userDonations.length}</p>
                <p className="text-stone-500 text-xs">Donations</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-md text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-stone-800">
                  {userDonations.filter(d => d.status === 'collected').length}
                </p>
                <p className="text-stone-500 text-xs">Completed</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-md text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-stone-800">
                  {userDonations.filter(d => d.status === 'available').length}
                </p>
                <p className="text-stone-500 text-xs">Available</p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-stone-800">Account Information</h3>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#9CCC65] text-white rounded-xl text-sm font-medium hover:bg-[#8db854] transition-colors"
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-sm outline-none focus:border-[#9CCC65] disabled:text-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-sm outline-none focus:border-[#9CCC65] disabled:text-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-stone-500 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-sm outline-none focus:border-[#9CCC65] disabled:text-stone-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}