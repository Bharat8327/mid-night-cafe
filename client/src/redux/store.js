import { configureStore } from '@reduxjs/toolkit';

import AuthReducer from './features/AuthSlice.js';
import productReducer from './features/ProductSlice.js';

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    product: productReducer,
  },
});

export default store;
