import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/donations/';

interface Donation {
  _id: string;
  donorId?: string;
  name: string;
  email?: string;
  phone: string;
  address: string;
  foodType: string;
  quantity: string;
  expiryDate: string;
  description?: string;
  organizationType?: string;
  city?: string;
  state?: string;
  imageUrl?: string;
  availableFrom?: string;
  availableUntil?: string;
  status: 'available' | 'claimed' | 'collected'| 'completed' | 'pending' | 'rejected' | 'delivered';
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
  };
  volunteerId?: string;
  volunteer?: {
    id: string;
    name: string;
    phone: string;
  };
  donar?: {
    id: string;
    name: string;
    phone: string;
  };
}

interface DonationState {
  donations: Donation[];
  loading: boolean;
  error: string | null;
}

const initialState: DonationState = {
  donations: [],
  loading: false,
  error: null,
};

export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async (status?: string) => {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  }
);

export const createDonation = createAsyncThunk(
  'donations/createDonation',
  async (donation: Partial<Donation>) => {
    const response = await axios.post(API_URL, donation);
    return response.data;
  }
);

export const updateDonationStatus = createAsyncThunk(
  'donations/updateDonationStatus',
  async ({
    id,
    status,
    volunteerId,
    volunteer,
  }: {
    id: string;
    status: string;
    volunteerId?: string;
    volunteer?: Donation['volunteer'];
  }) => {
    const response = await axios.patch(`${API_URL}${id}/status`, {
      status,
      ...(volunteerId ? { volunteerId } : {}),
      ...(volunteer ? { volunteer } : {}),
    });
    return response.data;
  }
);

export const deleteDonation = createAsyncThunk(
  'donations/deleteDonation',
  async (id: string) => {
    await axios.delete(`${API_URL}${id}`);
    return id;
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch donations';
      })
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.donations.unshift(action.payload);
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create donation';
      })
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        const index = state.donations.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) {
          state.donations[index] = action.payload;
        }
      })
      .addCase(deleteDonation.fulfilled, (state, action) => {
        state.donations = state.donations.filter((d) => d._id !== action.payload);
      });
  },
});

export const { clearError } = donationSlice.actions;
export default donationSlice.reducer;
