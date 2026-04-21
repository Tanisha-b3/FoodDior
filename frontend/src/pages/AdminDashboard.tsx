import { useAppSelector } from '../store/hooks';
import { Shield, Users, Package, ClipboardList, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { donations } = useAppSelector((state) => state.donations);
  const { requests } = useAppSelector((state) => state.requests);
  const { users } = useAppSelector((state) => state.users);

  const stats = {
    totalDonations: donations.length,
    totalRequests: requests?.length || 0,
    totalUsers: users?.length || 0,
    completed: donations.filter(d => d.status === 'collected').length,
    pending: donations.filter(d => d.status === 'pending').length,
    available: donations.filter(d => d.status === 'available').length,
  };

  const adminLinks = [
    { path: '/admin/users', label: 'Manage Users', icon: Users, color: 'bg-blue-500' },
    { path: '/admin/donations', label: 'All Donations', icon: Package, color: 'bg-green-500' },
    { path: '/admin/requests', label: 'All Requests', icon: ClipboardList, color: 'bg-purple-500' },
    { path: '/admin/analytics', label: 'Analytics', icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800">Admin Dashboard</h1>
              <p className="text-stone-500">Manage your platform</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-stone-800">{stats.totalUsers}</p>
            <p className="text-sm text-stone-500">Total Users</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-stone-800">{stats.totalDonations}</p>
            <p className="text-sm text-stone-500">Total Donations</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <ClipboardList className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-stone-800">{stats.totalRequests}</p>
            <p className="text-sm text-stone-500">Total Requests</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-stone-800">{stats.completed}</p>
            <p className="text-sm text-stone-500">Completed</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md mb-8">
          <h2 className="font-bold text-lg text-stone-800 mb-6">Donation Status Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{stats.available}</p>
              <p className="text-sm text-green-600">Available</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
              <p className="text-sm text-amber-600">Pending</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
              <p className="text-sm text-blue-600">Collected</p>
            </div>
          </div>
        </div>

        {/* Admin Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md hover:shadow-lg transition-all group"
            >
              <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-stone-800">{link.label}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}