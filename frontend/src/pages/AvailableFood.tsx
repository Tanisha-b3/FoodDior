import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations } from '../store/slices/donationSlice';
import { createRequest } from '../store/slices/requestSlice';
import { Search, Filter, MapPin, Clock, Utensils, ShoppingBag } from 'lucide-react';

export default function AvailableFood() {
  const dispatch = useAppDispatch();
  const { donations } = useAppSelector((state: any) => state.donations);
  const { currentUser } = useAppSelector((state: any) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const availableDonations = donations.filter((d: any) => 
    d.status === 'available' && 
    (filterType === 'all' || d.foodType?.toLowerCase() === filterType) &&
    (d.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     d.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const foodTypes = ['all', ' VEG', ' NON-VEG', ' BOTH'];

  const handleRequestFood = async (donation: any) => {
    if (!currentUser?._id) {
      alert('Please sign in first.');
      return;
    }

    const quantityRequested = window.prompt('Enter quantity needed', donation.quantity || '1');

    if (!quantityRequested) {
      return;
    }

    try {
      setRequestingId(donation._id);
      await dispatch(createRequest({
        donation: donation._id,
        requester: currentUser._id,
        quantityRequested,
        notes: `Requested from available food board by ${currentUser.name}`,
      })).unwrap();
      alert('Food request submitted successfully.');
    } catch (error) {
      console.error('Failed to request donation:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Available Food
          </h1>
          <p className="text-stone-500">Browse and request available food donations near you</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by food type or donor..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-stone-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#9CCC65]/30 focus:border-[#9CCC65]"
              >
                {foodTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {availableDonations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-bold text-stone-700 mb-2">No Food Available</h3>
            <p className="text-stone-500">Check back later for new donations</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableDonations.map((donation: any) => (
              <div key={donation._id} className="bg-white rounded-2xl border border-stone-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-r from-[#9CCC65]/20 to-[#8db854]/20 flex items-center justify-center">
                  <Utensils className="w-12 h-12 text-[#5a8a2a]" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      donation.foodType === 'VEG' ? 'bg-green-100 text-green-700' :
                      donation.foodType === 'NON-VEG' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {donation.foodType}
                    </span>
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-stone-800 mb-2">{donation.foodType} Food</h3>
                  <p className="text-sm text-stone-500 mb-3 line-clamp-2">{donation.description}</p>
                  <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
                    <MapPin className="w-4 h-4 text-stone-400" />
                    {donation.address}
                  </div>
                  <button
                    onClick={() => handleRequestFood(donation)}
                    disabled={requestingId === donation._id}
                    className="w-full py-3 bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white rounded-xl font-medium hover:shadow-md transition-all disabled:opacity-60"
                  >
                    {requestingId === donation._id ? 'Requesting...' : 'Request This Food'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
