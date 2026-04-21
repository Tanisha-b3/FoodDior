export type OrganizationType = 'hotel' | 'restaurant' | 'marriage_hall' | 'party' | 'household' | 'ngo' | 'old_age_home' | 'charity';

export type DonationStatus = 'available' | 'claimed' | 'collected' | 'completed' | 'pending' | 'rejected' | 'delivered';

export type UserRole = 'donor' | 'recipient' | 'volunteer' | 'admin';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface FoodDonation {
  id: string;
  donorId: string;
  donorName: string;
  organizationType: OrganizationType;
  foodType: string;
  quantity: string;
  description: string;
  imageUrl?: string;
  pickupAddress: string;
  city: string;
  state: string;
  phone: string;
  location?: Location;
  distance?: number;
  availableFrom: string;
  availableUntil: string;
  status: DonationStatus;
  claimedBy?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface FoodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  organizationType: OrganizationType;
  requiredQuantity: string;
  description: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  skills: string;
  availability: string;
  rating?: number;
  completedPickups?: number;
  createdAt: string;
  cities?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  state: string;
  rating: number;
  totalDonations: number;
  totalPickups: number;
  createdAt: string;
}

export interface ImpactStats {
  totalMealsSaved: number;
  totalCO2Reduced: number;
  totalFoodRescued: number;
  activeDonors: number;
  activeVolunteers: number;
  totalPickups: number;
}

export interface Review {
  id: string;
  donationId: string;
  reviewerName: string;
  rating: number;
  feedback: string;
  createdAt: string;
}