import Request from '../models/Request.js';
import Donation from '../models/Donation.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

export const createRequest = async (req, res) => {
  try {
    const donation = await Donation.findById(req.body.donation);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation is not available' });
    }

    const request = new Request({
      ...req.body,
      foodType: req.body.foodType || donation.foodType,
      description: req.body.description || donation.description || '',
      location: req.body.location || donation.address || '',
      phone: req.body.phone || donation.phone || '',
      name: req.body.name || donation.name || '',
    });
    const savedRequest = await request.save();

    const notificationUserId = donation.donorId || donation.donar?.id;

    if (notificationUserId && mongoose.Types.ObjectId.isValid(notificationUserId)) {
      await Notification.create({
        user: notificationUserId,
        title: 'New Request',
        message: 'Someone has requested your donation',
        type: 'request',
        relatedId: savedRequest._id
      });
    }

    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { status, requester, donation } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (requester) filter.requester = requester;
    if (donation) filter.donation = donation;

    const requests = await Request.find(filter)
      .populate('donation')
      .populate('requester', 'name email')
      .populate('organization', 'name')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('donation')
      .populate('requester', 'name email phone')
      .populate('organization', 'name address phone');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status, pickupTime, notes } = req.body;
    const updateData = { status };
    if (pickupTime) updateData.pickupTime = pickupTime;
    if (notes) updateData.notes = notes;

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('donation requester');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status === 'approved') {
      await Donation.findByIdAndUpdate(request.donation._id, { status: 'claimed' });
    } else if (status === 'completed') {
      await Donation.findByIdAndUpdate(request.donation._id, { status: 'collected' });
    }

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.params.userId })
      .populate('donation')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
