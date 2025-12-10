import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  auth,
  googleAuthProvider,
  githubAuthProvider,
} from '../../config/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { getCookie, setCookie } from '../../utils/utils.js';
import { notifyError, notifyInfo, notifySuccess } from '../../utils/toast.js';

export const signUp = createAsyncThunk(
  'auth/signup',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/u/signup`,
        data,
      );
      notifyInfo('Account Created Successfully');
      return {
        success: response.data.success,
        message: response.data.message,
        user: response.data.data || null,
      };
    } catch (error) {
      notifyError(error?.response?.data?.message);

      return rejectWithValue(
        error?.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

export const login = createAsyncThunk('auth/login', async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/u/login`,
      {
        ...data,
      },
      { withCredentials: true },
    );

    setCookie('token', response.data.data.token);
    notifySuccess('login Successfully');
    console.log(response.data.data);

    return response.data.data;
  } catch (error) {
    notifyError(error?.response?.data?.message);
  }
});

export const signInWithGoogle = createAsyncThunk('auth/google', async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const idToken = await result.user.getIdToken();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/u/verify`,
      {
        idToken,
      },
    );
    setCookie('token', response.data.data.token);
    notifySuccess('login Successfully with google');
    return response.data.data;
  } catch (error) {
    notifyError(error.message);
    console.log(error);
  }
});

export const signInWithGithub = createAsyncThunk('auth/github', async () => {
  try {
    const result = await signInWithPopup(auth, githubAuthProvider);
    const idToken = result._tokenResponse.idToken;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/u/gitverify`,
      {
        idToken,
      },
    );
    setCookie('token', response.data.data.token);
    notifySuccess('login Successfully with github');
    return response.data.data;
  } catch (error) {
    notifyError('error ', error.message);
    console.log(error);
  }
});

const initialState = {
  isLoading: false,
  authenticated: false,
  userProfile: {},
  name: null,
  id: null,
  role: null,
};

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
        state.authenticated = action.payload?.authenticated;
        state.name = action.payload?.name;
        state.id = action.payload?.id;
        state.role = action.payload?.role;

        setCookie('name', action.payload?.name);
        setCookie('id', action.payload?.id);
        setCookie('role', action.payload?.role);
        setCookie('authenticated', action.payload?.authenticated);
      });

    // for google auth
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authenticated = action.payload?.authenticated;
        state.name = action.payload?.name;
        state.id = action.payload?.id;
        state.role = action.payload?.role;
        setCookie('name', action.payload?.name);
        setCookie('id', action.payload?.id);
        setCookie('authenticated', action.payload?.authenticated);
        setCookie('role', action.payload?.role);
      });

    // sign in with github
    builder
      .addCase(signInWithGithub.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signInWithGithub.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authenticated = action.payload?.authenticated;
        state.name = action.payload?.name;
        state.id = action.payload?.id;
        state.role = action.payload?.role;
        setCookie('name', action.payload?.name);
        setCookie('id', action.payload?.id);
        setCookie('authenticated', action.payload?.authenticated);
        setCookie('role', action.payload?.role);
      });

    // for signup (create account)
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default AuthSlice.reducer;
