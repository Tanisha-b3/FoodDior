import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations } from '../store/slices/donationSlice';
import { fetchRequests } from '../store/slices/requestSlice';
import { fetchUsers } from '../store/slices/userSlice';
import {TrendingUp, Users, Package, ClipboardList, ArrowUp,  } from 'lucide-react';

export default function AdminAnalytics() {
  const dispatch = useAppDispatch();
  const { donations } = useAppSelector((state) => state.donations);
  const { requests } = useAppSelector((state) => state.requests);
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchDonations());
    dispatch(fetchRequests());
    dispatch(fetchUsers());
  }, [dispatch]);

  const stats = {
    totalDonations: donations.length,
    totalRequests: requests?.length || 0,
    totalUsers: users?.length || 0,
    completed: donations.filter(d => d.status === 'collected').length,
    pending: donations.filter(d => d.status === 'pending').length,
    available: donations.filter(d => d.status === 'available').length,
  };

  const completionRate = stats.totalDonations > 0 
    ? Math.round((stats.completed / stats.totalDonations) * 100) 
    : 0;

  const roleStats = {
    donor: users?.filter(u => u.role === 'donor').length || 0,
    receiver: users?.filter(u => u.role === 'receiver').length || 0,
    volunteer: users?.filter(u => u.role === 'volunteer').length || 0,
    admin: users?.filter(u => u.role === 'admin').length || 0,
  };

  const metrics = [
    { label: 'Total Donations', value: stats.totalDonations, change: 12, icon: Package, color: 'bg-green-500' },
    { label: 'Total Requests', value: stats.totalRequests, change: 8, icon: ClipboardList, color: 'bg-purple-500' },
    { label: 'Total Users', value: stats.totalUsers, change: 15, icon: Users, color: 'bg-blue-500' },
    { label: 'Completion Rate', value: `${completionRate}%`, change: 5, icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Analytics
          </h1>
          <p className="text-stone-500">Platform performance and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
              <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center mb-4`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-stone-800 mb-1">{metric.value}</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-600 flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" />
                  {metric.change}%
                </span>
                <span className="text-stone-500">vs last month</span>
              </div>
              <p className="text-sm text-stone-500 mt-1">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Donation Status */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md mb-8">
          <h2 className="font-bold text-lg text-stone-800 mb-6">Donation Status Distribution</h2>
          <div className="space-y-4">
            {[
              { label: 'Available', value: stats.available, color: 'bg-green-500' },
              { label: 'Pending', value: stats.pending, color: 'bg-amber-500' },
              { label: 'Collected', value: stats.completed, color: 'bg-blue-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">{item.label}</span>
                  <span className="font-medium text-stone-800">{item.value}</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all`} 
                    style={{ width: `${stats.totalDonations > 0 ? (item.value / stats.totalDonations) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
          <h2 className="font-bold text-lg text-stone-800 mb-6">User Distribution by Role</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(roleStats).map(([role, count]) => (
              <div key={role} className="text-center p-4 bg-stone-50 rounded-xl">
                <p className="text-3xl font-bold text-stone-800">{count}</p>
                <p className="text-sm text-stone-500 capitalize">{role}s</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
