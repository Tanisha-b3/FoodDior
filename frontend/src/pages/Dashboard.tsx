import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations, updateDonationStatus, deleteDonation } from '../store/slices/donationSlice';
import { fetchRequests, updateRequestStatus } from '../store/slices/requestSlice';
import { fetchUsers, logoutUser } from '../store/slices/userSlice';
import { 
  Package, Users, Bell, LogOut, Home, Heart, 
  Settings, ChevronRight, Award, MapPin, ShoppingBag,
  Truck, ClipboardList,  BarChart3, UserPlus, 
  CheckCircle, Clock, AlertCircle, TrendingUp,
  Utensils, Gift, HandHelping, Activity
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.users);
  const { users } = useAppSelector((state) => state.users);
  const { donations } = useAppSelector((state) => state.donations);
  const { requests } = useAppSelector((state) => state.requests);
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'requests' | 'deliveries' | 'users'>('overview');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated && !currentUser) {
      navigate('/auth');
      return;
    }
    
    // Fetch data based on role
    dispatch(fetchDonations());
    dispatch(fetchRequests());

    if (currentUser?.role === 'admin') {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAuthenticated, currentUser, navigate]);

  // Role-based data filtering
  const getRoleBasedDonations = () => {
    if (!currentUser) return [];
    
    switch(currentUser.role) {
      case 'admin':
        return donations;
      case 'donor':
        return donations.filter((d) => (d.donar && d.donar.id === currentUser._id) || d.donorId === currentUser._id || d.name === currentUser.name);
      case 'volunteer':
        return donations.filter((d) => d.volunteer?.id === currentUser._id || d.volunteerId === currentUser._id);
      default:
        return [];
    }
  };

  const getRoleBasedRequests = () => {
    if (!currentUser) return [];
    
    switch(currentUser.role) {
      case 'admin':
        return requests;
      case 'receiver':
        return requests.filter(r => r.requester?._id === currentUser._id);
      default:
        return [];
    }
  };

  const userDonations = getRoleBasedDonations();
  const userRequests = getRoleBasedRequests();

  // Role-based statistics
  const getStats = () => {
    if (!currentUser) return [];

    const baseStats = [];
    
    switch(currentUser.role) {
      case 'donor':
        baseStats.push(
          { label: 'Total Donations', value: userDonations.length, icon: Gift, color: '#C4754A' },
          { label: 'Collected', value: userDonations.filter(d => d.status === 'collected').length, icon: CheckCircle, color: '#7DB87A' },
          { label: 'Meals Saved', value: userDonations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0), icon: Award, color: '#4A9ECC' }
        );
        break;
        
      case 'receiver':
        baseStats.push(
          { label: 'Total Requests', value: userRequests.length, icon: Utensils, color: '#C4754A' },
          { label: 'Fulfilled', value: userRequests.filter(r => r.status === 'completed').length, icon: CheckCircle, color: '#7DB87A' },
          { label: 'Pending', value: userRequests.filter(r => r.status === 'pending').length, icon: Clock, color: '#FFA500' }
        );
        break;
        
      case 'volunteer':
        const assignedDeliveries = donations.filter((d) => d.volunteer?.id === currentUser._id || d.volunteerId === currentUser._id);
        baseStats.push(
          { label: 'Assigned Tasks', value: assignedDeliveries.length, icon: Truck, color: '#C4754A' },
          { label: 'Completed', value: assignedDeliveries.filter(d => d.status === 'delivered' || d.status === 'collected').length, icon: CheckCircle, color: '#7DB87A' },
          { label: 'In Progress', value: assignedDeliveries.filter(d => d.status === 'claimed').length, icon: Activity, color: '#4A9ECC' }
        );
        break;
        
      case 'admin':
        baseStats.push(
          { label: 'Total Users', value: users.length, icon: Users, color: '#C4754A' },
          { label: 'Total Donations', value: donations.length, icon: Gift, color: '#7DB87A' },
          { label: 'Active Requests', value: requests.filter(r => r.status === 'pending').length, icon: AlertCircle, color: '#FFA500' },
        
        );
        break;
        
      default:
        baseStats.push(
          { label: 'Donations', value: userDonations.length, icon: Package, color: '#C4754A' },
          { label: 'Requests', value: userRequests.length, icon: Heart, color: '#7DB87A' },
          { label: 'Impact', value: 'Active', icon: Award, color: '#4A9ECC' }
        );
    }
    
    return baseStats;
  };

  const stats = getStats();

  // Role-based menu items
  const getMenuItems = () => {
    const commonItems = [
      { path: '/', label: 'Home', icon: Home },
      // { path: '/dashboard', label: 'Dashboard', icon: Activity },
    ];

    const roleItems = {
      donor: [
        { path: '/donate', label: 'Donate Food', icon: Gift },
        { path: '/my-donations', label: 'My Donations', icon: Package },
        { path: '/impact', label: 'My Impact', icon: Award },
      ],
      receiver: [
        { path: '/request', label: 'Request Food', icon: Utensils },
        { path: '/my-requests', label: 'My Requests', icon: ClipboardList },
        { path: '/available-food', label: 'Available Food', icon: ShoppingBag },
      ],
      volunteer: [
        { path: '/deliveries', label: 'Deliveries', icon: Truck },
        { path: '/my-tasks', label: 'My Tasks', icon: ClipboardList },
        { path: '/routes', label: 'Routes', icon: MapPin },
      ],
      admin: [
        { path: '/admin/users', label: 'Manage Users', icon: Users },
        { path: '/admin/donations', label: 'All Donations', icon: Package },
        { path: '/admin/requests', label: 'All Requests', icon: ClipboardList },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/volunteers', label: 'Volunteers', icon: HandHelping },
      ],
    };

    let items = [...commonItems];
    if (currentUser?.role && roleItems[currentUser.role]) {
      items.push(...roleItems[currentUser.role]);
    }
    
    items.push({ path: '/profile', label: 'Profile', icon: Settings });
    
    return items;
  };

  const menuItems = getMenuItems();

  const handleStatusChange = async (id: string, status: string) => {
    await dispatch(updateDonationStatus({ id, status }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      await dispatch(deleteDonation(id));
    }
  };

  const handleRequestStatus = async (id: string, status: string) => {
    await dispatch(updateRequestStatus({ id, status }));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  // Render role-specific content
  const renderOverviewContent = () => {
    if (!currentUser) return null;

    switch(currentUser.role) {
      case 'donor':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Recent Donations</h3>
            {userDonations.length === 0 ? (
              <div className="text-center py-12 text-[#6B5A52]">
                <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>You haven't made any donations yet.</p>
                <Link to="/donate" className="inline-block mt-4 px-4 py-2 bg-[#C4754A] text-white rounded-xl text-sm font-medium">
                  Make Your First Donation
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userDonations.slice(0, 5).map((donation) => (
                  <div key={donation._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#151210] border border-[#2A2420]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#C4754A]/10">
                      <Gift className="w-5 h-5 text-[#C4754A]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{donation.foodType}</p>
                      <p className="text-xs text-[#6B5A52]">{donation.quantity} • {donation.address}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'available' ? 'bg-[#7DB87A]/20 text-[#7DB87A]' :
                      donation.status === 'collected' ? 'bg-[#4A9ECC]/20 text-[#4A9ECC]' :
                      donation.status === 'claimed' ? 'bg-[#C4754A]/20 text-[#C4754A]' :
                      'bg-[#9B72CF]/20 text-[#9B72CF]'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'receiver':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Recent Requests</h3>
            {userRequests.length === 0 ? (
              <div className="text-center py-12 text-[#6B5A52]">
                <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>You haven't made any requests yet.</p>
                <Link to="/request" className="inline-block mt-4 px-4 py-2 bg-[#7DB87A] text-white rounded-xl text-sm font-medium">
                  Request Food
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userRequests.slice(0, 5).map((request) => (
                  <div key={request._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#151210] border border-[#2A2420]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#7DB87A]/10">
                      <Utensils className="w-5 h-5 text-[#7DB87A]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{request.donation?.foodType || 'Food Request'}</p>
                      <p className="text-xs text-[#6B5A52]">Quantity: {request.quantityRequested}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-[#FFA500]/20 text-[#FFA500]' :
                      request.status === 'approved' ? 'bg-[#7DB87A]/20 text-[#7DB87A]' :
                      request.status === 'completed' ? 'bg-[#4A9ECC]/20 text-[#4A9ECC]' :
                      'bg-[#CC4A6A]/20 text-[#CC4A6A]'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'volunteer':
        const assignedDeliveries = donations.filter((d) => d.volunteer?.id === currentUser._id || d.volunteerId === currentUser._id);
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Assigned Deliveries</h3>
            {assignedDeliveries.length === 0 ? (
              <div className="text-center py-12 text-[#6B5A52]">
                <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No deliveries assigned yet.</p>
                <p className="text-sm">Check back later for new assignments.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedDeliveries.map((delivery) => (
                  <div key={delivery._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#151210] border border-[#2A2420]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#4A9ECC]/10">
                      <Truck className="w-5 h-5 text-[#4A9ECC]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">From: {delivery.name}</p>
                      <p className="text-xs text-[#6B5A52]">{delivery.address} • {delivery.foodType}</p>
                    </div>
                    <select
                      value={delivery.status}
                      onChange={(e) => handleStatusChange(delivery._id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl text-xs bg-[#231E1A] border border-[#332B26] outline-none"
                    >
                      <option value="claimed">Pick Up</option>
                      <option value="collected">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'admin':
        const pendingRequests = requests.filter(r => r.status === 'pending');
        const activeDonations = donations.filter(d => d.status === 'available');
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#151210] border border-[#2A2420]">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-5 h-5 text-[#FFA500]" />
                  <h4 className="font-semibold">Pending Requests</h4>
                </div>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <button 
                  onClick={() => setActiveTab('requests')}
                  className="mt-2 text-xs text-[#4A9ECC] hover:underline"
                >
                  Review Requests →
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-[#151210] border border-[#2A2420]">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-5 h-5 text-[#7DB87A]" />
                  <h4 className="font-semibold">Available Donations</h4>
                </div>
                <p className="text-2xl font-bold">{activeDonations.length}</p>
                <button 
                  onClick={() => setActiveTab('donations')}
                  className="mt-2 text-xs text-[#4A9ECC] hover:underline"
                >
                  View All →
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/users" className="p-3 rounded-xl bg-[#151210] border border-[#2A2420] text-center hover:bg-[#231E1A] transition-colors">
                  <UserPlus className="w-5 h-5 mx-auto mb-2 text-[#C4754A]" />
                  <span className="text-sm">Manage Users</span>
                </Link>
                <Link to="/admin/analytics" className="p-3 rounded-xl bg-[#151210] border border-[#2A2420] text-center hover:bg-[#231E1A] transition-colors">
                  <TrendingUp className="w-5 h-5 mx-auto mb-2 text-[#7DB87A]" />
                  <span className="text-sm">View Analytics</span>
                </Link>
                <Link to="/admin/volunteers" className="p-3 rounded-xl bg-[#151210] border border-[#2A2420] text-center hover:bg-[#231E1A] transition-colors">
                  <HandHelping className="w-5 h-5 mx-auto mb-2 text-[#4A9ECC]" />
                  <span className="text-sm">Manage Volunteers</span>
                </Link>
                <Link to="/admin/donations" className="p-3 rounded-xl bg-[#151210] border border-[#2A2420] text-center hover:bg-[#231E1A] transition-colors">
                  <Package className="w-5 h-5 mx-auto mb-2 text-[#C4754A]" />
                  <span className="text-sm">All Donations</span>
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12 text-[#6B5A52]">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Welcome to your dashboard!</p>
            <div className="flex gap-3 justify-center mt-4">
              <Link to="/donate" className="px-4 py-2 bg-[#C4754A] text-white rounded-xl text-sm font-medium">
                Donate Food
              </Link>
              <Link to="/request" className="px-4 py-2 bg-[#7DB87A] text-white rounded-xl text-sm font-medium">
                Request Food
              </Link>
            </div>
          </div>
        );
    }
  };

  const renderDonationsTab = () => {
    if (currentUser?.role === 'admin') {
      return (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#2A2420]">
                <tr className="text-left text-[#6B5A52]">
                  <th className="pb-3">Donor</th>
                  <th className="pb-3">Food Type</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id} className="border-b border-[#2A2420]">
                    <td className="py-3">{donation.name}</td>
                    <td className="py-3">{donation.foodType}</td>
                    <td className="py-3">{donation.quantity}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        donation.status === 'available' ? 'bg-[#7DB87A]/20 text-[#7DB87A]' :
                        donation.status === 'collected' ? 'bg-[#4A9ECC]/20 text-[#4A9ECC]' :
                        'bg-[#C4754A]/20 text-[#C4754A]'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={donation.status}
                        onChange={(e) => handleStatusChange(donation._id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-xs bg-[#231E1A] border border-[#332B26] outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="claimed">Claimed</option>
                        <option value="collected">Collected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Donor view
    return (
      <div className="space-y-3">
        {userDonations.length === 0 ? (
          <div className="text-center py-12 text-[#6B5A52]">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No donations yet</p>
          </div>
        ) : (
          userDonations.map((d) => (
            <div key={d._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#151210] border border-[#2A2420]">
              <div className="flex-1">
                <p className="font-medium text-sm">{d.foodType}</p>
                <p className="text-xs text-[#6B5A52]">{d.quantity} • {d.address}</p>
              </div>
              <select
                value={d.status}
                onChange={(e) => handleStatusChange(d._id, e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-[#231E1A] border border-[#332B26] outline-none"
              >
                <option value="available">Available</option>
                <option value="claimed">Claimed</option>
                <option value="collected">Collected</option>
              </select>
              <button
                onClick={() => handleDelete(d._id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#CC4A6A] hover:bg-[#CC4A6A]/10"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0D0A08] text-[#F5EFE8]">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-[#151210] border-r border-[#2A2420] flex flex-col transition-all duration-300 fixed h-full z-10`}>
        <div className="p-4 border-b border-[#2A2420]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#C4754A] to-[#9A5534] flex items-center justify-center">
              <span className="text-white text-sm font-bold">FD</span>
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-bold">FoodDoer</div>
                <div className="text-xs text-[#6B5A52] capitalize">{currentUser?.role} Dashboard</div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#A89080] hover:bg-[#231E1A] hover:text-[#F5EFE8] transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[#2A2420] space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#231E1A] text-xs text-[#6B5A52] hover:text-[#F5EFE8] transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#CC4A6A]/10 text-[#CC4A6A] text-sm hover:bg-[#CC4A6A]/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-[#180E09] to-[#251610] p-6 border-b border-[#2A2420] sticky top-0 z-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, <span className="text-[#C4754A]">{currentUser?.name || 'User'}</span>
              </h1>
              <p className="text-[#6B5A52] text-sm mt-1 capitalize">
                {currentUser?.role} Dashboard - Track your impact
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-9 h-9 rounded-xl bg-[#1C1714] border border-[#332B26] flex items-center justify-center hover:bg-[#231E1A] transition-colors">
                <Bell className="w-4 h-4 text-[#A89080]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C4754A] text-[9px] font-bold flex items-center justify-center">
                  {requests.filter(r => r.status === 'pending').length}
                </span>
              </button>
              <Link
                to="/profile"
                className="w-9 h-9 rounded-xl bg-[#1C1714] border border-[#332B26] flex items-center justify-center text-sm font-bold hover:bg-[#231E1A] transition-colors"
              >
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Link>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1C1714] rounded-2xl p-5 border border-[#2A2420] hover:border-[#C4754A]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}16` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-[#6B5A52] uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'overview' ? 'bg-[#C4754A] text-white' : 'bg-[#1C1714] text-[#A89080] hover:text-[#F5EFE8]'
              }`}
            >
              Overview
            </button>
            {(currentUser?.role === 'donor' || currentUser?.role === 'admin') && (
              <button
                onClick={() => setActiveTab('donations')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'donations' ? 'bg-[#C4754A] text-white' : 'bg-[#1C1714] text-[#A89080] hover:text-[#F5EFE8]'
                }`}
              >
                Donations
              </button>
            )}
            {(currentUser?.role === 'receiver' || currentUser?.role === 'admin') && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'requests' ? 'bg-[#C4754A] text-white' : 'bg-[#1C1714] text-[#A89080] hover:text-[#F5EFE8]'
                }`}
              >
                Requests
              </button>
            )}
            {currentUser?.role === 'volunteer' && (
              <button
                onClick={() => setActiveTab('deliveries')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'deliveries' ? 'bg-[#C4754A] text-white' : 'bg-[#1C1714] text-[#A89080] hover:text-[#F5EFE8]'
                }`}
              >
                Deliveries
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-[#1C1714] rounded-3xl border border-[#2A2420]">
            {activeTab === 'overview' && (
              <div className="p-6">
                {renderOverviewContent()}
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="p-6">
                {renderDonationsTab()}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="p-6">
                {userRequests.length === 0 ? (
                  <div className="text-center py-12 text-[#6B5A52]">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No requests yet</p>
                    {currentUser?.role === 'receiver' && (
                      <Link to="/request" className="inline-block mt-4 px-4 py-2 bg-[#7DB87A] text-white rounded-xl text-sm font-medium">
                        Make a Request
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userRequests.map((r) => (
                      <div key={r._id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#151210] border border-[#2A2420]">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{r.donation?.foodType || 'Food Request'}</p>
                          <p className="text-xs text-[#6B5A52]">Quantity: {r.quantityRequested}</p>
                          {r.specialInstructions && (
                            <p className="text-xs text-[#6B5A52] mt-1">Note: {r.specialInstructions}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          r.status === 'pending' ? 'bg-[#FFA500]/20 text-[#FFA500]' :
                          r.status === 'approved' ? 'bg-[#7DB87A]/20 text-[#7DB87A]' :
                          r.status === 'completed' ? 'bg-[#4A9ECC]/20 text-[#4A9ECC]' :
                          'bg-[#CC4A6A]/20 text-[#CC4A6A]'
                        }`}>
                          {r.status}
                        </span>
                        {currentUser?.role === 'admin' && r.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRequestStatus(r._id, 'approved')}
                              className="px-3 py-1 rounded-lg bg-[#7DB87A]/20 text-[#7DB87A] text-xs hover:bg-[#7DB87A]/30"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequestStatus(r._id, 'rejected')}
                              className="px-3 py-1 rounded-lg bg-[#CC4A6A]/20 text-[#CC4A6A] text-xs hover:bg-[#CC4A6A]/30"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deliveries' && currentUser?.role === 'volunteer' && (
              <div className="p-6">
                {renderOverviewContent()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
