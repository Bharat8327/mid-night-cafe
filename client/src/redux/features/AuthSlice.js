import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  auth,
  googleAuthProvider,
  githubAuthProvider,
} from '../../config/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const initialState = {
  isLoading: false,
};

export const signUp = createAsyncThunk('auth/signup', async (data) => {
  try {
    const response = await axios.post('http://localhost:3000/u/signup', {
      ...data,
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
});

export const login = createAsyncThunk('auth/login', async (data) => {
  try {
    const response = axios.post(import.meta.env.VITE_API_URL, {
      ...data,
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
});

export const signInWithGoogle = createAsyncThunk('auth/google', async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const idToken = await result.user.getIdToken();
    const response = await axios.post('http://localhost:3000/u/verify', {
      idToken,
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
});

export const signInWithGithub = createAsyncThunk('auth/github', async () => {
  try {
    const result = await signInWithPopup(auth, githubAuthProvider);
    const idToken = result._tokenResponse.idToken;
    const response = await axios.post('http://localhost:3000/u/gitverify', {
      idToken,
    });
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // for login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
      });

    // for google auth
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
      });

    // for signup (create account)
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
      });
  },
});

export default AuthSlice.reducer;
