import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/loginService';
import blogService from '../services/blogService';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser(state, action) {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

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
      dispatch(setUser(loggedUser));
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
    dispatch(clearUser());
  };
};

export default userSlice.reducer;
