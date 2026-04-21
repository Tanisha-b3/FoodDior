import Donation from '../models/Donation.js';

const buildDonationPayload = (body) => {
  const payload = {
    donorId: body.donorId || null,
    name: body.name,
    email: body.email || '',
    phone: body.phone,
    address: body.address,
    foodType: body.foodType,
    quantity: body.quantity,
    expiryDate: body.expiryDate || body.availableUntil,
    description: body.description || '',
    organizationType: body.organizationType || '',
    city: body.city || '',
    state: body.state || '',
    imageUrl: body.imageUrl || '',
    availableFrom: body.availableFrom || null,
    availableUntil: body.availableUntil || body.expiryDate || null,
    status: body.status || 'available',
    location: body.location || undefined,
    volunteerId: body.volunteerId || null,
    volunteer: body.volunteer || undefined,
  };

  if (body.donar) {
    payload.donar = body.donar;
  } else {
    payload.donar = {
      id: body.donorId || '',
      name: body.name || '',
      phone: body.phone || '',
    };
  }

  return payload;
};

export const createDonation = async (req, res) => {
  try {
    const donation = new Donation(buildDonationPayload(req.body));
    const savedDonation = await donation.save();
    res.status(201).json(savedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDonations = async (req, res) => {
  try {
    const { status, donorId, donorName, donorPhone, volunteerId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (donorId) {
      filter.$or = [{ donorId }, { 'donar.id': donorId }];
    }
    if (donorName) filter.name = donorName;
    if (donorPhone) filter.phone = donorPhone;
    if (volunteerId) {
      filter.$or = [...(filter.$or || []), { volunteerId }, { 'volunteer.id': volunteerId }];
    }

    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      buildDonationPayload({ ...req.body, expiryDate: req.body.expiryDate || req.body.availableUntil }),
      { new: true, runValidators: true }
    );
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const { status, volunteerId, volunteer } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status, ...(volunteerId !== undefined ? { volunteerId } : {}), ...(volunteer ? { volunteer } : {}) },
      { new: true, runValidators: true }
    );
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
