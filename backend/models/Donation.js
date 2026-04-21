import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  description: String,
  organizationType: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  availableFrom: {
    type: Date,
    default: null
  },
  availableUntil: {
    type: Date,
    default: null
  },
  location: {
    lat: {
      type: Number,
      default: null
    },
    lng: {
      type: Number,
      default: null
    }
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  volunteer: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    }
  },
  donar: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    }
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'collected', 'completed', 'pending', 'rejected', 'delivered'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Donation', donationSchema);
