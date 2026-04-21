import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications/';

interface Notification {
  _id: string;
  user: any;
  title: string;
  message: string;
  type: 'donation' | 'request' | 'status' | 'system';
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (userId?: string) => {
    const url = userId ? `${API_URL}?userId=${userId}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string) => {
    const response = await axios.patch(`${API_URL}${id}/read`);
    return response.data;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userId: string) => {
    await axios.get(`${API_URL}user/${userId}/read-all`);
    return userId;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id: string) => {
    await axios.delete(`${API_URL}${id}`);
    return id;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n: Notification) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
          state.unreadCount = state.notifications.filter((n) => !n.read).length;
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n._id !== action.payload);
        state.unreadCount = state.notifications.filter((n) => !n.read).length;
      });
  },
});

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;