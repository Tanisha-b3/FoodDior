import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, deleteUser, updateUserRole } from '../store/slices/userSlice';
import { Search, UserCircle, Mail, Phone, MapPin, Star, Trash2, Edit2, CheckCircle, XCircle, Loader2, ShieldCheck, KeyRound } from 'lucide-react';
import { API_ENDPOINTS } from '../lib/api';

interface VolunteerApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  skills?: string;
  availability?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ApprovedCredentials {
  applicationId: string;
  email: string;
  password?: string | null;
  message: string;
}

export default function AdminVolunteers() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state: any) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [reviewingApplicationId, setReviewingApplicationId] = useState<string | null>(null);
  const [approvedCredentials, setApprovedCredentials] = useState<ApprovedCredentials | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());

    const loadApplications = async () => {
      try {
        setLoadingApplications(true);
        const response = await axios.get(`${API_ENDPOINTS.volunteerApplications}?status=pending`);
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to load volunteer applications:', error);
      } finally {
        setLoadingApplications(false);
      }
    };

    loadApplications();
  }, [dispatch]);

  

  const volunteers = users?.filter((u: any) => u.role === 'volunteer') || [];

  const filteredVolunteers = volunteers.filter((u: any) => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === 'all' || u.city === filterCity;
    return matchesSearch && matchesCity;
  });

const cities = [
  'all',
  ...Array.from(
    new Set(
      volunteers.map((v: any) => v.city).filter(Boolean)
    )
  )
] as string[];

  const pendingApplications = applications.filter((application) => application.status === 'pending');

  const refreshVolunteerData = async () => {
    await dispatch(fetchUsers());

    const response = await axios.get(`${API_ENDPOINTS.volunteerApplications}?status=pending`);
    setApplications(response.data);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      await dispatch(deleteUser(userId));
      dispatch(fetchUsers());
    }
  };

  const handleRoleUpdate = async (userId: string) => {
    if (editRole) {
      await dispatch(updateUserRole({ userId, role: editRole }));
      setEditingId(null);
      setEditRole('');
      dispatch(fetchUsers());
    }
  };

  const totalPickups = volunteers.reduce((sum: number, v: any) => sum + (v.totalPickups || 0), 0);
  const avgRating = volunteers.length > 0 
    ? volunteers.reduce((sum: number, v: any) => sum + (v.rating || 0), 0) / volunteers.length 
    : 0;

  const handleApproveApplication = async (applicationId: string) => {
    try {
      setReviewingApplicationId(applicationId);
      const response = await axios.put(`${API_ENDPOINTS.volunteerApplications}${applicationId}/approve`);

      setApprovedCredentials({
        applicationId,
        email: response.data.user?.email || response.data.credentials?.email,
        password: response.data.credentials?.password || null,
        message: response.data.message,
      });

      await refreshVolunteerData();
    } catch (error) {
      console.error('Failed to approve volunteer application:', error);
      alert('Failed to approve volunteer application. Please try again.');
    } finally {
      setReviewingApplicationId(null);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      setReviewingApplicationId(applicationId);
      await axios.put(`${API_ENDPOINTS.volunteerApplications}${applicationId}/reject`);
      await refreshVolunteerData();
    } catch (error) {
      console.error('Failed to reject volunteer application:', error);
      alert('Failed to reject volunteer application. Please try again.');
    } finally {
      setReviewingApplicationId(null);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#8D6E63]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Manage Volunteers
          </h1>
          <p className="text-stone-500">View and manage platform volunteers</p>
        </div>

        {approvedCredentials && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-100 p-2">
                <KeyRound className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-emerald-900">Volunteer Login Ready</h2>
                <p className="mt-1 text-sm text-emerald-700">{approvedCredentials.message}</p>
                <div className="mt-3 rounded-xl bg-white p-4 text-sm text-stone-700">
                  <p><span className="font-semibold">Email:</span> {approvedCredentials.email}</p>
                  <p><span className="font-semibold">Password:</span> {approvedCredentials.password || 'Use the volunteer\'s existing password'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-stone-100 bg-white shadow-md">
          <div className="border-b border-stone-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2">
                <ShieldCheck className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-800">Pending Volunteer Applications</h2>
                <p className="text-sm text-stone-500">Approve an application to create volunteer login access.</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loadingApplications ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#8D6E63]" />
              </div>
            ) : pendingApplications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-200 px-6 py-12 text-center">
                <p className="text-stone-500">No pending volunteer requests</p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {pendingApplications.map((application) => (
                  <div key={application._id} className="rounded-2xl border border-stone-100 bg-stone-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-stone-800">
                          {application.firstName} {application.lastName}
                        </h3>
                        <p className="mt-1 text-sm text-stone-500">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700">
                        Pending
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-stone-600">
                      <p><span className="font-medium text-stone-800">Email:</span> {application.email}</p>
                      <p><span className="font-medium text-stone-800">Phone:</span> {application.phone}</p>
                      <p><span className="font-medium text-stone-800">Location:</span> {application.city}, {application.state}</p>
                      {application.skills && (
                        <p><span className="font-medium text-stone-800">Skills:</span> {application.skills}</p>
                      )}
                      {application.availability && (
                        <p><span className="font-medium text-stone-800">Availability:</span> {application.availability}</p>
                      )}
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => handleApproveApplication(application._id)}
                        disabled={reviewingApplicationId === application._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {reviewingApplicationId === application._id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRejectApplication(application._id)}
                        disabled={reviewingApplicationId === application._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md text-center">
            <UserCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-stone-800">{volunteers.length}</p>
            <p className="text-sm text-stone-500">Total Volunteers</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-stone-800">
              {volunteers.filter((v: any) => v.totalPickups > 0).length}
            </p>
            <p className="text-sm text-stone-500">Active</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md text-center">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-stone-800">{avgRating.toFixed(1)}</p>
            <p className="text-sm text-stone-500">Avg Rating</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md text-center">
            <MapPin className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-stone-800">{totalPickups}</p>
            <p className="text-sm text-stone-500">Total Pickups</p>
          </div>
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
                placeholder="Search volunteers..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
              />
            </div>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city === 'all' ? 'All Cities' : city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Volunteers Table */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Volunteer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Stats</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <UserCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <p className="text-stone-500">No volunteers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredVolunteers.map((user: any) => (
                    <tr key={user._id} className="hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserCircle className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <span className="font-medium text-stone-800">{user.name}</span>
                            <p className="text-xs text-stone-500">{user._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Mail className="w-4 h-4 text-stone-400" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Phone className="w-4 h-4 text-stone-400" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <MapPin className="w-4 h-4 text-stone-400" />
                          {user.city || 'N/A'}, {user.state || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-stone-800 font-medium">{user.totalPickups || 0}</span>
                            <span className="text-stone-500"> pickups</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-stone-800">{user.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === user._id ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30"
                          >
                            <option value="">Select Role</option>
                            <option value="donor">Donor</option>
                            <option value="receiver">Receiver</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive !== false 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {user.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {editingId === user._id ? (
                            <>
                              <button
                                onClick={() => handleRoleUpdate(user._id)}
                                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditRole('');
                                }}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(user._id);
                                  setEditRole(user.role);
                                }}
                                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4 text-stone-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                          )}
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
