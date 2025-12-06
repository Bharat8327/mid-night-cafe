import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie, setCookie } from '../../utils/utils';
import axios from 'axios';
import { notifyError } from '../../utils/toast';

export const getUserProfile = createAsyncThunk('u/profile', async () => {
  try {
    const token = getCookie('token');
    const id = getCookie('id');

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/u/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data.data;
  } catch (error) {
    notifyError(error.message);
  }
});

export const getAllProduct = createAsyncThunk('u/product', async () => {
  try {
    const id = getCookie('id');
    const token = getCookie('token');

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/u/products`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data.data;
  } catch (error) {
    notifyError(error.message);
  }
});

const UserProfileSlice = createSlice({
  name: 'User',
  initialState: {
    isLoading: false,
    userDetails: {},
    product: {},
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        setCookie('name', action?.payload?.fullName);
        setCookie('email', action.payload?.email);
        setCookie('mobile', action.payload?.mobile);
        setCookie('address', action.payload?.location);
        state.userDetails = action.payload;
      });
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      });
  },
});

export default UserProfileSlice.reducer;
