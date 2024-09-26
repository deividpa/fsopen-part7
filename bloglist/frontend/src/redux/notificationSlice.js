import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: '', // success, error, info
  content: '',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      const { content, type } = action.payload;
      state.type = type;
      state.content = content;
    },
    clearNotification: (state) => {
      state.type = '';
      state.content = '';
    },
  },
});

export const { showNotification, clearNotification } =
  notificationSlice.actions;

export const showNotificationWithTimeout = (content, type, duration) => {
  return (dispatch) => {
    dispatch(showNotification({ content, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration);
  };
};

export default notificationSlice.reducer;
