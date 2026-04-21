import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations, updateDonationStatus } from '../store/slices/donationSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { Package, Search,MapPin, Phone, Clock, UserPlus } from 'lucide-react';

export default function AdminDonations() {
  const dispatch = useAppDispatch();
  const { donations } = useAppSelector((state) => state.donations);
  const { users } = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVolunteers, setSelectedVolunteers] = useState<Record<string, string>>({});
  const [assigningDonationId, setAssigningDonationId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDonations());
    dispatch(fetchUsers());
  }, [dispatch]);

  const volunteers = users.filter((user) => user.role === 'volunteer');

  const filteredDonations = donations.filter(d => {
    const matchesSearch = d.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'available', 'pending', 'collected', 'rejected'];

  const handleAssignVolunteer = async (donationId: string) => {
    const volunteerId = selectedVolunteers[donationId];
    const volunteerUser = volunteers.find((user) => user._id === volunteerId);

    if (!volunteerId || !volunteerUser) {
      return;
    }

    try {
      setAssigningDonationId(donationId);
      await dispatch(updateDonationStatus({
        id: donationId,
        status: 'pending',
        volunteerId: volunteerUser._id,
        volunteer: {
          id: volunteerUser._id,
          name: volunteerUser.name,
          phone: volunteerUser.phone,
        },
      })).unwrap();
    } catch (error) {
      console.error('Failed to assign volunteer:', error);
      alert('Failed to assign volunteer. Please try again.');
    } finally {
      setAssigningDonationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            All Donations
          </h1>
          <p className="text-stone-500">Manage all food donations on the platform</p>
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
                placeholder="Search donations..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Donations List */}
        <div className="space-y-4">
          {filteredDonations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center">
              <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-700 mb-2">No Donations Found</h3>
              <p className="text-stone-500">No donations match your search criteria</p>
            </div>
          ) : (
            filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#9CCC65]/15 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#5a8a2a]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-stone-800">{donation.foodType} Food</h3>
                        <p className="text-sm text-stone-500">By: {donation.name}</p>
                      </div>
                    </div>
                    <p className="text-stone-600 mb-3">{donation.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-stone-400" />
                          <span className="text-stone-600">{donation.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">{donation.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">{new Date(donation.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch gap-3 lg:min-w-[260px]">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium text-center ${
                      donation.status === 'available' ? 'bg-green-100 text-green-700' :
                      donation.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      donation.status === 'collected' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {donation.status}
                    </span>

                    {donation.volunteer?.name && (
                      <div className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
                        <p className="font-semibold text-stone-800">Assigned Volunteer</p>
                        <p>{donation.volunteer.name}</p>
                        <p>{donation.volunteer.phone}</p>
                      </div>
                    )}

                    {donation.status === 'available' && (
                      volunteers.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-500">
                          No volunteers available to assign.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 rounded-xl bg-stone-50 p-3">
                          <label className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                            Assign Volunteer
                          </label>
                          <select
                            value={selectedVolunteers[donation._id] || ''}
                            onChange={(e) => setSelectedVolunteers((current) => ({
                              ...current,
                              [donation._id]: e.target.value,
                            }))}
                            className="rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30"
                          >
                            <option value="">Select volunteer</option>
                            {volunteers.map((volunteer) => (
                              <option key={volunteer._id} value={volunteer._id}>
                                {volunteer.name} ({volunteer.phone})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssignVolunteer(donation._id)}
                            disabled={!selectedVolunteers[donation._id] || assigningDonationId === donation._id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5a8a2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4e7924] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <UserPlus className="w-4 h-4" />
                            {assigningDonationId === donation._id ? 'Assigning...' : 'Assign Volunteer'}
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
