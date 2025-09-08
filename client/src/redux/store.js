import { configureStore } from '@reduxjs/toolkit';

import AuthReducer from './features/AuthSlice.js';
import productReducer from './features/ProductSlice.js';
import UserReducer from './userFeatures/UserProfileSlice.js';

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    product: productReducer,
    profile: UserReducer,
  },
});

export default store;
