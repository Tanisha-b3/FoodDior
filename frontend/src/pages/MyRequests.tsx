import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMyRequests } from '../store/slices/requestSlice';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const statusConfig: Record<string, { label: string; classes: string; icon: any }> = {
  pending:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  approved:  { label: 'Approved',  classes: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  rejected:  { label: 'Rejected',  classes: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  completed: { label: 'Completed', classes: 'bg-sky-50 text-sky-700 border-sky-200', icon: CheckCircle },
};

export default function MyRequests() {
  const dispatch = useAppDispatch();
  const { myRequests, loading } = useAppSelector((state) => state.requests);
  const { currentUser } = useAppSelector((state) => state.users);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchMyRequests(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const filteredRequests = filter === 'all' ? myRequests : myRequests.filter(r => r.status === filter);

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </Link>
          <div>
            <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-stone-800">My Requests</h1>
            <p className="text-stone-500 text-sm">Track your food requests</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
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
            <Loader2 className="w-8 h-8 border-4 border-[#9CCC65] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white border-2 border-dashed border-stone-200">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-400 font-medium">No requests found</p>
            <Link to="/request" className="text-[#5a8a2a] font-semibold hover:underline mt-2 inline-block">
              Request Food
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const sc = statusConfig[request.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              return (
                <div key={request._id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${sc.classes} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                        <span className="text-stone-400 text-xs">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-stone-800 text-lg">
                        {request.donation?.foodType || 'Food Donation'}
                      </h3>
                      <p className="text-[#5a8a2a] font-semibold">
                        Requested: {request.quantityRequested}
                      </p>
                      {request.donation && (
                        <div className="mt-3 p-3 bg-stone-50 rounded-xl text-sm text-stone-600">
                          <p><strong>Donor:</strong> {request.donation.name}</p>
                          <p><strong>Address:</strong> {request.donation.address}</p>
                          <p><strong>Phone:</strong> {request.donation.phone}</p>
                        </div>
                      )}
                      {request.notes && (
                        <p className="mt-2 text-stone-500 text-sm">
                          <strong>Notes:</strong> {request.notes}
                        </p>
                      )}
                      {request.pickupTime && (
                        <p className="mt-2 text-amber-600 text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Pickup: {new Date(request.pickupTime).toLocaleString()}
                        </p>
                      )}
                    </div>
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