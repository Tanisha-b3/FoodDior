import { configureStore } from '@reduxjs/toolkit';
import donationReducer from './slices/donationSlice';
import userReducer from './slices/userSlice';
import organizationReducer from './slices/organizationSlice';
import requestReducer from './slices/requestSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    donations: donationReducer,
    users: userReducer,
    organizations: organizationReducer,
    requests: requestReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;