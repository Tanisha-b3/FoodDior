import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchRequests } from '../store/slices/requestSlice';
import { ClipboardList, Search, Clock, MapPin, Phone, Eye } from 'lucide-react';

export default function AdminRequests() {
  const dispatch = useAppDispatch();
  const { requests } = useAppSelector((state) => state.requests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const allRequests = requests || [];
  
  const filteredRequests = allRequests.filter(r => {
    const matchesSearch = r.foodType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'pending', 'approved', 'rejected', 'completed'];

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            All Requests
          </h1>
          <p className="text-stone-500">Manage all food requests on the platform</p>
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
                placeholder="Search requests..."
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

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center">
              <ClipboardList className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-700 mb-2">No Requests Found</h3>
              <p className="text-stone-500">No requests match your search criteria</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-stone-800">{request.foodType} Food Request</h3>
                        <p className="text-sm text-stone-500">By: {request.name}</p>
                      </div>
                    </div>
                    <p className="text-stone-600 mb-3">{request.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-600">{new Date(request.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      request.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      request.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                    <button className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
                      <Eye className="w-5 h-5 text-stone-600" />
                    </button>
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
