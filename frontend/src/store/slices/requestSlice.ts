import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/requests/';

interface Request {
  _id: string;
  donation: any;
  requester: any;
  organization?: any;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  quantityRequested: string;
  notes?: string;
  pickupTime?: string;
  createdAt: string;
  foodType: string;
  description: string;
  location: string;
  phone: string;
  name: string;
  specialInstructions?: string;
}

interface RequestState {
  requests: Request[];
  myRequests: Request[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestState = {
  requests: [],
  myRequests: [],
  loading: false,
  error: null,
};

export const fetchRequests = createAsyncThunk(
  'requests/fetchRequests',
  async (params?: { status?: string; donation?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.donation) queryParams.append('donation', params.donation);
    const response = await axios.get(`${API_URL}?${queryParams}`);
    return response.data;
  }
);

export const fetchMyRequests = createAsyncThunk(
  'requests/fetchMyRequests',
  async (userId: string) => {
    const response = await axios.get(`${API_URL}my/${userId}`);
    return response.data;
  }
);

export const createRequest = createAsyncThunk(
  'requests/create',
  async (requestData: { donation: string; requester: string; quantityRequested: string; notes?: string }) => {
    const response = await axios.post(API_URL, requestData);
    return response.data;
  }
);

export const updateRequestStatus = createAsyncThunk(
  'requests/updateStatus',
  async ({ id, status, pickupTime, notes }: { id: string; status: string; pickupTime?: string; notes?: string }) => {
    const response = await axios.patch(`${API_URL}${id}`, { status, pickupTime, notes });
    return response.data;
  }
);

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch requests';
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.myRequests = action.payload;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
      });
  },
});

export const { clearError } = requestSlice.actions;
export default requestSlice.reducer;