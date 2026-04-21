import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchDonations } from '../store/slices/donationSlice';

interface ImpactStats {
  totalMealsSaved: number;
  totalCO2Reduced: number;
  totalFoodRescued: number;
  activeDonors: number;
  activeVolunteers: number;
  totalPickups: number;
}

export default function Impact() {
  const dispatch = useAppDispatch();
  const { donations } = useAppSelector((state) => state.donations);
  const { currentUser } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const myDonations = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return donations.filter((donation) => (
      donation.donorId === currentUser._id ||
      donation.donar?.id === currentUser._id ||
      donation.name === currentUser.name ||
      donation.phone === currentUser.phone
    ));
  }, [currentUser, donations]);

  const completedDonations = myDonations.filter((donation) => ['completed', 'collected', 'delivered'].includes(donation.status));

  const stats: ImpactStats = {
    totalMealsSaved: completedDonations.reduce((sum, donation) => sum + (parseInt(donation.quantity, 10) || 0), 0),
    totalCO2Reduced: completedDonations.length * 13,
    totalFoodRescued: completedDonations.length * 5,
    activeDonors: myDonations.length > 0 ? 1 : 0,
    activeVolunteers: new Set(completedDonations.map((donation) => donation.volunteer?.id).filter(Boolean)).size,
    totalPickups: completedDonations.length,
  };

  const monthlyMap = myDonations.reduce<Record<string, { month: string; donations: number; meals: number }>>((acc, donation) => {
    const date = new Date(donation.createdAt);
    const month = date.toLocaleString('en-US', { month: 'short' });

    if (!acc[month]) {
      acc[month] = { month, donations: 0, meals: 0 };
    }

    acc[month].donations += 1;
    acc[month].meals += parseInt(donation.quantity, 10) || 0;

    return acc;
  }, {});

  const monthlyData = Object.values(monthlyMap).slice(-6);

  const maxMeals = Math.max(...monthlyData.map(d => d.meals), 1);

  return (
    <div>
      <section className="bg-gradient-to-r from-[#9CCC65] to-[#8D6E63] py-12 text-center text-white">
          <h1 className="text-4xl font-bold font-[Georgia] mb-2">
            My Impact Dashboard
          </h1>
          <p className="text-xl">Track your personal impact in saving food and helping people</p>
      </section>

      <section className="py-12 bg-[#F1EDE5]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-4">🍱</div>
              <div className="text-4xl font-bold text-[#8D6E63]">{stats.totalMealsSaved}</div>
               <div className="text-gray-600 font-semibold">Meals Shared</div>
               <p className="text-sm text-gray-500 mt-2">From your completed donations</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-4">🌍</div>
              <div className="text-4xl font-bold text-[#9CCC65]">{stats.totalCO2Reduced}</div>
              <div className="text-gray-600 font-semibold">kg CO₂ Reduced</div>
              <p className="text-sm text-gray-500 mt-2">Environmental impact</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-4">📦</div>
              <div className="text-4xl font-bold text-[#8D6E63]">{stats.totalFoodRescued}</div>
              <div className="text-gray-600 font-semibold">kg Food Rescued</div>
              <p className="text-sm text-gray-500 mt-2">From going to waste</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-4">🤝</div>
              <div className="text-4xl font-bold text-[#9CCC65]">{stats.activeDonors}</div>
               <div className="text-gray-600 font-semibold">Active Donor</div>
               <p className="text-sm text-gray-500 mt-2">Your contribution status</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-4">💪</div>
              <div className="text-4xl font-bold text-[#8D6E63]">{stats.activeVolunteers}</div>
               <div className="text-gray-600 font-semibold">Supporting Volunteers</div>
               <p className="text-sm text-gray-500 mt-2">Volunteers linked to your completed donations</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-5xl mb-4">🚚</div>
              <div className="text-4xl font-bold text-[#9CCC65]">{stats.totalPickups}</div>
              <div className="text-gray-600 font-semibold">Total Pickups</div>
              <p className="text-sm text-gray-500 mt-2">Successful deliveries</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
               <h2 className="text-2xl font-bold mb-6">Monthly Donations Trend</h2>
             {monthlyData.length === 0 ? (
               <div className="text-center py-16 text-gray-500">No donation history yet</div>
             ) : (
               <div className="flex items-end justify-between gap-4 h-64">
                 {monthlyData.map((data) => (
                   <div key={data.month} className="flex flex-col items-center flex-1">
                     <div className="w-full flex flex-col items-center">
                       <div 
                         className="w-full max-w-12 bg-gradient-to-t from-[#8D6E63] to-[#9CCC65] rounded-t-lg transition-all hover:opacity-80"
                         style={{ height: `${(data.meals / maxMeals) * 200}px` }}
                       />
                     </div>
                     <div className="mt-2 text-center">
                       <div className="font-semibold text-sm">{data.month}</div>
                       <div className="text-xs text-gray-500">{data.meals} meals</div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">🌍 Environmental Impact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{stats.totalCO2Reduced} kg CO₂ emissions prevented</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{Math.round(stats.totalFoodRescued * 0.4)} liters of water saved</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{Math.round(stats.totalFoodRescued * 10)} meals equivalent energy saved</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4">💝 Social Impact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                   <span>{stats.totalMealsSaved} meals shared</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{stats.activeVolunteers} volunteers engaged</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Zero hunger goal advanced</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
