import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  quantityRequested: {
    type: String,
    required: true
  },
  notes: String,
  name: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  foodType: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  pickupTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Request', requestSchema);
