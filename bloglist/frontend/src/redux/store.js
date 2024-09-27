import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import blogReducer from './blogSlice';
import loginReducer from './loginSlice';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    login: loginReducer,
    users: usersReducer,
  },
});

export default store;
