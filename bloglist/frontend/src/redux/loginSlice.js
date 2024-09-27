import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/loginService';
import blogService from '../services/blogService';
import { fetchBlogs } from './blogSlice';

const loginSlice = createSlice({
  name: 'login',
  initialState: null,
  reducers: {
    setUserLogin(state, action) {
      return action.payload;
    },
    clearUserLogin(state, action) {
      return null;
    },
  },
});

export const { setUserLogin, clearUserLogin } = loginSlice.actions;

// Function to handle the login
export const loginUser = ({ username, password }) => {
  return async (dispatch) => {
    try {
      const loggedUser = await loginService.login({ username, password });
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(loggedUser)
      );
      blogService.setToken(loggedUser.token);
      dispatch(setUserLogin(loggedUser));
      await dispatch(fetchBlogs());
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Wrong credentials' };
    }
  };
};

// Function to handle the logout
export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.setToken(null);
    dispatch(clearUserLogin());
  };
};

export default loginSlice.reducer;
