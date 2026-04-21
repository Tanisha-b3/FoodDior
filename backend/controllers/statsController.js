import Donation from '../models/Donation.js';
import VolunteerApplication from '../models/VolunteerApplication.js';
import CommunityRequest from '../models/CommunityRequest.js';
import User from '../models/User.js';

export const getImpactStats = async (req, res) => {
  try {
    const [donations, volunteers, communityRequests, users] = await Promise.all([
      Donation.find(),
      VolunteerApplication.countDocuments({ status: { $ne: 'rejected' } }),
      CommunityRequest.countDocuments(),
      User.find().select('role'),
    ]);

    const completedDonations = donations.filter((donation) => ['completed', 'collected', 'delivered'].includes(donation.status));
    const activeDonors = new Set(
      donations
        .map((donation) => donation.donorId?.toString() || donation.donar?.id || donation.name)
        .filter(Boolean)
    ).size;

    const stats = {
      totalMealsSaved: completedDonations.length * 15,
      totalCO2Reduced: Math.round(completedDonations.length * 5 * 2.5),
      totalFoodRescued: completedDonations.length * 5,
      activeDonors,
      activeVolunteers: volunteers || users.filter((user) => user.role === 'volunteer').length,
      totalPickups: completedDonations.length,
      totalCommunityRequests: communityRequests,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
