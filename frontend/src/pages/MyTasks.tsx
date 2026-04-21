import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations } from '../store/slices/donationSlice';
import { ClipboardList, CheckCircle, Clock, PlayCircle } from 'lucide-react';

export default function MyTasks() {
  const dispatch = useAppDispatch();
  const { donations } = useAppSelector((state) => state.donations);
  const { currentUser } = useAppSelector((state) => state.users);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const myTasks = donations.filter((d) => (d.volunteer?.id === currentUser?._id || d.volunteerId === currentUser?._id) && d.status !== 'available');

  const pendingTasks = myTasks.filter(d => d.status === 'pending' || d.status === 'claimed');
  const completedTasks = myTasks.filter(d => d.status === 'collected' || d.status === 'delivered');

  const displayTasks = filter === 'all' ? myTasks : filter === 'pending' ? pendingTasks : completedTasks;

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-stone-800 mb-2">
            My Tasks
          </h1>
          <p className="text-stone-500">View and manage your assigned tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md text-center">
            <ClipboardList className="w-8 h-8 text-[#8D6E63] mx-auto mb-2" />
            <p className="text-3xl font-bold text-stone-800">{myTasks.length}</p>
            <p className="text-sm text-stone-500">Total Tasks</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md text-center">
            <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-stone-800">{pendingTasks.length}</p>
            <p className="text-sm text-stone-500">Pending</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-md text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-stone-800">{completedTasks.length}</p>
            <p className="text-sm text-stone-500">Completed</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-[#8D6E63] to-[#6E554D] text-white'
                  : 'bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        {displayTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-100">
            <ClipboardList className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-700 mb-2">No Tasks Found</h3>
            <p className="text-stone-500">You don't have any tasks in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      task.status === 'collected' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      {task.status === 'collected' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <PlayCircle className="w-6 h-6 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-800">{task.foodType} Food</h3>
                      <p className="text-sm text-stone-500">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'collected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {task.status}
                    </span>
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
