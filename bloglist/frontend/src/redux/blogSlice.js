import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogService';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setBlogs, addBlog } = blogSlice.actions;

// Function to fetch all blogs from the server
export const fetchBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAllSortedByLikes();
    dispatch(setBlogs(blogs));
  };
};

// Function to create a new blog
export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const createdBlog = await blogService.create(newBlog);
    dispatch(addBlog(createdBlog));
    return createdBlog;
  };
};

export default blogSlice.reducer;
