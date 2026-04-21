import mongoose from 'mongoose';

const communityRequestSchema = new mongoose.Schema({
  requesterName: {
    type: String,
    required: true,
  },
  organizationType: {
    type: String,
    enum: ['old_age_home', 'charity', 'ngo', 'household'],
    required: true,
  },
  requiredQuantity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('CommunityRequest', communityRequestSchema);
