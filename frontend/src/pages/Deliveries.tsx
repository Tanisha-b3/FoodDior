import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations } from '../store/slices/donationSlice';
import { Truck, Package, MapPin, Phone, Clock, CheckCircle, Circle, Navigation } from 'lucide-react';

export default function Deliveries() {
  const dispatch = useAppDispatch();
  const { donations } = useAppSelector((state) => state.donations);
  const { currentUser } = useAppSelector((state) => state.users);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const assignedDeliveries = donations.filter((d) => d.volunteer?.id === currentUser?._id || d.volunteerId === currentUser?._id);
  const pendingDeliveries = assignedDeliveries.filter(d => d.status === 'pending' || d.status === 'claimed');
  const completedDeliveries = assignedDeliveries.filter(d => d.status === 'collected' || d.status === 'delivered');

  const deliveries = activeTab === 'pending' ? pendingDeliveries : completedDeliveries;

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            Deliveries
          </h1>
          <p className="text-stone-500">Manage your delivery tasks</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Circle className="w-4 h-4" />
              Pending ({pendingDeliveries.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed ({completedDeliveries.length})
            </span>
          </button>
        </div>

        {/* Delivery List */}
        {deliveries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <Truck className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-700 mb-2">No Deliveries</h3>
            <p className="text-stone-500">
              {activeTab === 'pending' ? 'No pending deliveries at the moment' : 'No completed deliveries yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery._id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#9CCC65]/15 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#5a8a2a]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-stone-800">{delivery.foodType} Food</h3>
                        <p className="text-sm text-stone-500">{delivery.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-stone-400" />
                         <span className="text-stone-600">{delivery.address || `${delivery.location?.lat?.toFixed(4)}, ${delivery.location?.lng?.toFixed(4)}`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">{delivery.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">{new Date(delivery.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          delivery.status === 'collected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {delivery.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-[#9CCC65]/15 rounded-xl hover:bg-[#9CCC65]/25 transition-colors">
                      <Navigation className="w-5 h-5 text-[#5a8a2a]" />
                    </button>
                    {delivery.status !== 'collected' && (
                      <button className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
