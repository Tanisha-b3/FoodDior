import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/organizations/';

interface Organization {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'ngo' | 'charity' | 'food-bank' | 'shelter' | 'other';
  description?: string;
  verified: boolean;
  createdAt: string;
}

interface OrganizationState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  loading: false,
  error: null,
};

export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchOrganizations',
  async (params?: { type?: string; verified?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.verified !== undefined) queryParams.append('verified', String(params.verified));
    const response = await axios.get(`${API_URL}?${queryParams}`);
    return response.data;
  }
);

export const createOrganization = createAsyncThunk(
  'organizations/create',
  async (org: Partial<Organization>) => {
    const response = await axios.post(API_URL, org);
    return response.data;
  }
);

export const verifyOrganization = createAsyncThunk(
  'organizations/verify',
  async (id: string) => {
    const response = await axios.patch(`${API_URL}${id}/verify`);
    return response.data;
  }
);

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch organizations';
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.organizations.unshift(action.payload);
      })
      .addCase(verifyOrganization.fulfilled, (state, action) => {
        const index = state.organizations.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
      });
  },
});

export const { clearError } = organizationSlice.actions;
export default organizationSlice.reducer;