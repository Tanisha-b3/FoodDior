// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';



// Helper function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Get initial state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    setAuthToken(token);
    return {
      users: [],
      currentUser: JSON.parse(user),
      token,
      loading: false,
      error: null,
      isAuthenticated: true,
    };
  }
  
  return {
    users: [],
    currentUser: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  };
};

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'donor' | 'receiver' | 'admin' | 'volunteer';
  createdAt: string;
  isActive?: boolean;
  lastLogin?: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = getInitialState();

// Register User
export const registerUser = createAsyncThunk(
  'users/register',
  async (userData: { 
    name: string; 
    email: string; 
    phone: string; 
    password: string; 
    role?: string 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}register`, userData);
      const { token, user } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'users/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}login`, credentials);
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Fetch all users (Admin only)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}users`);
      console.log('Fetched users:', response.data.users);
      return response.data.users;
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Get current user profile
export const getCurrentUser = createAsyncThunk(
  'users/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}me`);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async (userData: { name?: string; phone?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}profile`, userData);
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Update user role (Admin only)
export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ userId, role }: { userId: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}users/${userId}/role`, { role });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

// Delete user (Admin only)
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'users/logout',
  async () => {
    setAuthToken(null);
    localStorage.removeItem('user');
    return null;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.users = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.token = null;
        state.isAuthenticated = false;
        state.users = [];
        state.error = null;
      });
  },
});

// Selectors
export const selectCurrentUser = (state: any) => state.users.currentUser;
export const selectIsAuthenticated = (state: any) => state.users.isAuthenticated;
export const selectUserRole = (state: any) => state.users.currentUser?.role;
export const selectUsers = (state: any) => state.users.users;
export const selectLoading = (state: any) => state.users.loading;
export const selectError = (state: any) => state.users.error;

// Role-based selectors
export const selectIsDonor = (state: any) => state.users.currentUser?.role === 'donor';
export const selectIsReceiver = (state: any) => state.users.currentUser?.role === 'receiver';
export const selectIsVolunteer = (state: any) => state.users.currentUser?.role === 'volunteer';
export const selectIsAdmin = (state: any) => state.users.currentUser?.role === 'admin';
export const selectHasRole = (state: any, roles: string[]) => {
  const userRole = state.users.currentUser?.role;
  return userRole ? roles.includes(userRole) : false;
};

export const { clearError, clearUserData } = userSlice.actions;
export default userSlice.reducer;