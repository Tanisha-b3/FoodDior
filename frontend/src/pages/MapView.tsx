import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { FoodDonation, OrganizationType } from '../types';
import { API_ENDPOINTS } from '../lib/api';

const organizationIcons: Record<OrganizationType, string> = {
  hotel: '🏨',
  restaurant: '🍽️',
  marriage_hall: '🏛️',
  party: '🎉',
  household: '🏠',
  ngo: '🤝',
  old_age_home: '👴',
  charity: '💝',
};

export default function MapView() {
  const [donations, setDonations] = useState<FoodDonation[]>([]);

  const [filter, setFilter] = useState<string>('all');
  const [selectedDonation, setSelectedDonation] = useState<FoodDonation | null>(null);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.donations);
        setDonations(
          response.data.map((item: any) => ({
            id: item._id,
            donorId: item.donorId || item.donar?.id || '',
            donorName: item.name,
            organizationType: item.organizationType || 'ngo',
            foodType: item.foodType,
            quantity: item.quantity,
            description: item.description || '',
            imageUrl: item.imageUrl,
            pickupAddress: item.address,
            city: item.city || '',
            state: item.state || '',
            phone: item.phone,
            location: item.location,
            availableFrom: item.availableFrom || item.createdAt,
            availableUntil: item.availableUntil || item.expiryDate,
            status: item.status,
            createdAt: item.createdAt,
          }))
        );
      } catch (error) {
        console.error('Failed to load map donations:', error);
      }
    };

    loadDonations();
  }, []);

  const availableDonations = donations.filter(d => d.status === 'available');
  
  const filteredDonations = filter === 'all' 
    ? availableDonations 
    : availableDonations.filter(d => d.organizationType === filter);

  const uniqueTypes = [...new Set(availableDonations.map(d => d.organizationType))];

  return (
    <div>
      <section className="bg-gradient-to-r from-[#8D6E63] to-[#9CCC65] py-12 text-center text-white">
        <h1 className="text-4xl font-bold font-[Georgia] mb-2">
          Live Map View
        </h1>
        <p className="text-xl">Find nearby food donations in your area</p>
      </section>

      <section className="py-8 bg-[#F1EDE5]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Filter by Type:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8D6E63]"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>
                      {organizationIcons[type]} {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ml-auto text-sm text-gray-600">
                Showing {filteredDonations.length} available donations
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-100 p-4 border-b">
                  <h3 className="font-bold">Map View</h3>
                  <p className="text-sm text-gray-500">Interactive map showing donation locations</p>
                </div>
                <div className="relative h-96 bg-gradient-to-b from-blue-50 to-green-50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <p className="text-gray-600">Map View</p>
                      <p className="text-sm text-gray-500">Google Maps API integration ready</p>
                      <p className="text-xs text-gray-400 mt-2">Configure GOOGLE_MAPS_API_KEY for live map</p>
                    </div>
                  </div>
                  {filteredDonations.map((donation, index) => (
                    <div
                      key={donation.id}
                      className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                      style={{
                        top: `${20 + (index * 60) % 70}%`,
                        left: `${10 + (index * 80) % 80}%`,
                      }}
                      onClick={() => setSelectedDonation(donation)}
                    >
                      <div className="text-4xl drop-shadow-lg hover:drop-shadow-xl">
                        {organizationIcons[donation.organizationType]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gray-100 p-4 border-b">
                  <h3 className="font-bold">Nearby Donations</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredDonations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No donations available
                    </div>
                  ) : (
                    filteredDonations.map((donation) => (
                      <div
                        key={donation.id}
                        onClick={() => setSelectedDonation(donation)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedDonation?.id === donation.id ? 'bg-[#F1EDE5]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{organizationIcons[donation.organizationType]}</span>
                          <span className="font-semibold">{donation.foodType}</span>
                        </div>
                        <p className="text-sm text-gray-600">{donation.quantity}</p>
                        <p className="text-xs text-gray-500">📍 {donation.city}, {donation.state}</p>
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Available
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {selectedDonation && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-wrap gap-4">
                {selectedDonation.imageUrl && (
                  <img 
                    src={selectedDonation.imageUrl} 
                    alt={selectedDonation.foodType}
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{organizationIcons[selectedDonation.organizationType]}</span>
                    <h3 className="text-2xl font-bold">{selectedDonation.foodType}</h3>
                  </div>
                  <p className="text-lg text-gray-700">{selectedDonation.quantity}</p>
                  <p className="text-gray-600 mt-1">{selectedDonation.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="font-semibold">📍 Address</p>
                      <p className="text-gray-600">{selectedDonation.pickupAddress}</p>
                      <p className="text-gray-600">{selectedDonation.city}, {selectedDonation.state}</p>
                    </div>
                    <div>
                      <p className="font-semibold">📞 Contact</p>
                      <p className="text-gray-600">{selectedDonation.phone}</p>
                      <p className="text-gray-600">{selectedDonation.donorName}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Link
                      to="/request"
                      className="bg-[#9CCC65] text-white px-6 py-2 rounded-lg hover:bg-[#7ab54d] transition-colors"
                    >
                      Request This Food
                    </Link>
                    <button
                      onClick={() => setSelectedDonation(null)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
