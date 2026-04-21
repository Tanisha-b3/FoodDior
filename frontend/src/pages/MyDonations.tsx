import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations, deleteDonation, updateDonationStatus } from '../store/slices/donationSlice';
import { MapPin, Phone, Clock, Trash2,  Package, ArrowLeft } from 'lucide-react';

const statusConfig: Record<string, { label: string; classes: string }> = {
  available:  { label: 'Available',  classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  claimed:    { label: 'Claimed',    classes: 'bg-amber-50  text-amber-700  border-amber-200'  },
  collected:  { label: 'Collected',  classes: 'bg-sky-50    text-sky-700    border-sky-200'    },
};

export default function MyDonations() {
  const dispatch = useAppDispatch();
  const { donations, loading } = useAppSelector((state) => state.donations);
  const { currentUser } = useAppSelector((state) => state.users);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const userDonations = donations.filter((donation) => {
    if (!currentUser) {
      return false;
    }

    return (
      donation.donorId === currentUser._id ||
      donation.donar?.id === currentUser._id ||
      donation.name === currentUser.name ||
      donation.phone === currentUser.phone
    );
  });
  const filteredDonations = filter === 'all' ? userDonations : userDonations.filter(d => d.status === filter);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      await dispatch(deleteDonation(id));
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await dispatch(updateDonationStatus({ id, status }));
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-stone-800">My Donations</h1>
            <p className="text-stone-500 text-sm">Manage your food donations</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'available', 'claimed', 'collected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-[#2d1f1a] text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-[#9CCC65] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border-2 border-dashed border-stone-200">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-400 font-medium">No donations found</p>
            <Link to="/donate" className="text-[#5a8a2a] font-semibold hover:underline mt-2 inline-block">
              Donate Food
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => {
              const sc = statusConfig[donation.status] || statusConfig.available;
              return (
                <div key={donation._id} className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-md">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-stone-800 text-lg">{donation.foodType}</h3>
                        <p className="text-[#5a8a2a] font-semibold">{donation.quantity}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${sc.classes}`}>
                        {sc.label}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-stone-500 mb-4">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {donation.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {donation.phone}
                      </p>
                      {donation.expiryDate && (
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Until {new Date(donation.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {donation.status === 'available' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(donation._id, 'claimed')}
                          className="flex-1 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
                        >
                          Mark Claimed
                        </button>
                        <button
                          onClick={() => handleStatusChange(donation._id, 'collected')}
                          className="flex-1 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors"
                        >
                          Mark Collected
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleDelete(donation._id)}
                      className="w-full mt-2 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
