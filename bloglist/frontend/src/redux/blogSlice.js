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
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state
        .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
        .sort((a, b) => b.likes - a.likes);
    },
    deleteBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogSlice.actions;

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

// Function to update the likes of a blog
export const updateBlogLikes = (id, updatedBlog) => {
  return async (dispatch) => {
    const blogWithLikes = await blogService.update(id, updatedBlog);
    dispatch(updateBlog(blogWithLikes));
  };
};

// Function to delete a blog
export const removeBlog = (id) => {
  return async (dispatch) => {
    console.log('removing blog with id', id);
    await blogService.deleteBlog(id);
    dispatch(deleteBlog(id));
  };
};

export default blogSlice.reducer;
