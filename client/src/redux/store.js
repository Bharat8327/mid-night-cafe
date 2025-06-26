import { configureStore } from '@reduxjs/toolkit';

import AuthReducer from './features/AuthSlice.js';

const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

export default store;
