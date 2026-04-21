import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/slices/userSlice';
import { Users, Search, UserCircle,Trash2, Edit2 } from 'lucide-react';

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roles = ['all', 'donor', 'receiver', 'volunteer', 'admin'];

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Manage Users
          </h1>
          <p className="text-stone-500">View and manage platform users</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
              />
            </div>
            <div className="flex gap-2">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    filterRole === role
                      ? 'bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#9CCC65]/15 rounded-full flex items-center justify-center">
                            <UserCircle className="w-5 h-5 text-[#5a8a2a]" />
                          </div>
                          <span className="font-medium text-stone-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600">{user.email}</td>
                      <td className="px-6 py-4 text-stone-600">{user.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'volunteer' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'donor' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-stone-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
