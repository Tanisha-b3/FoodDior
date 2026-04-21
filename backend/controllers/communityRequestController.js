import CommunityRequest from '../models/CommunityRequest.js';

export const createCommunityRequest = async (req, res) => {
  try {
    const request = new CommunityRequest(req.body);
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCommunityRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await CommunityRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
