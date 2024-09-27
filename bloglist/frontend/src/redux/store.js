import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import blogReducer from './blogSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

export default store;
