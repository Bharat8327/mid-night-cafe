import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  auth,
  googleAuthProvider,
  githubAuthProvider,
} from '../../config/firebase.js';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { setCookie } from '../../utils/utils.js';

export const signUp = createAsyncThunk('auth/signup', async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/u/signup`,
      {
        ...data,
      },
    );
    return response;
  } catch (error) {
    console.log(error.message);
  }
});

export const login = createAsyncThunk('auth/login', async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/u/login`,
      {
        ...data,
      },
      { withCredentials: true },
    );

    // const verifyres = await fetch(
    //   `${import.meta.env.VITE_API_URL}/u/auth/verify`,
    //   {
    //     method: 'POST',
    //     credentials: 'include',
    //   },
    // );
    // const res = await verifyres.json();
    setCookie('token', response.data.data.token);

    return response.data.data;
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
    setCookie('token', response.data.data.token);
    return response.data.data;
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
    setCookie('token', response.data.data.token);
    return response.data.data;
  } catch (error) {
    console.log(error.message);
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
        state.authenticated = action?.payload?.authenticated;
        state.name = action?.payload?.name;
        state.id = action?.payload?.id;
        state.role = action?.payload?.role;

        setCookie('name', action?.payload?.name);
        setCookie('id', action?.payload?.id);
        setCookie('role', action?.payload?.role);
        setCookie('authenticated', action?.payload?.authenticated);
      });

    // for google auth
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authenticated = action.payload.authenticated;
        state.name = action.payload.name;
        state.id = action.payload.id;
        state.role = action.payload.role;
        setCookie('name', action.payload.name);
        setCookie('id', action.payload.id);
        setCookie('authenticated', action.payload.authenticated);
        setCookie('role', action.payload.role);
      });

    // sign in with github
    builder
      .addCase(signInWithGithub.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signInWithGithub.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authenticated = action.payload.authenticated;
        state.name = action.payload.name;
        state.id = action.payload.id;
        state.role = action.payload.role;
        setCookie('name', action.payload.name);
        setCookie('id', action.payload.id);
        setCookie('authenticated', action.payload.authenticated);
        setCookie('role', action.payload.role);
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
