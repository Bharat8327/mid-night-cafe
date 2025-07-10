import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/u/products`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
export const addNewItems = createAsyncThunk('product/create', async (data) => {
  try {
    const createProduct = await axios.post(
      `${import.meta.env.VITE_API_URL}/u/products`,
      data,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
      },
    );
    return createProduct;
  } catch (error) {
    console.log(error.message);
  }
});
export const updateProduct = createAsyncThunk(
  '/product/updateProduct',
  async (data) => {
    try {
      console.log('this is and availbility', data._id, data);

      const updateAvailbility = await axios.put(
        `${import.meta.env.VITE_API_URL}/u/products/${data._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
        },
      );
      console.log(updateAvailbility);
    } catch (error) {
      console.log(error.message);
    }
  },
);
export const deleteProduct = createAsyncThunk('/product/delete', async (id) => {
  try {
    console.log('this is id', id);
    const productDelte = await axios.delete(
      `${import.meta.env.VITE_API_URL}/u/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
      },
    );
    console.log(productDelte);
    return productDelte.data;
  } catch (error) {
    console.log(error.message);
  }
});
export const toggleAvailability = createAsyncThunk(
  '/product/availability',
  async ({ id, isAvailable }) => {
    try {
      const productAvailability = await axios.put(
        `${import.meta.env.VITE_API_URL}/u/availability/${id}`,
        { isAvailable },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
        },
      );
      console.log(productAvailability);
      return productAvailability.data;
    } catch (error) {
      console.log(error.message);
    }
  },
);

const initialState = {
  isLoading: false,
  product: [],
  error: null,
};

const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload || []; // adjust based on actual response shape
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products';
      });

    builder
      .addCase(addNewItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewItems.fulfilled, (state, action) => {
        console.log(action.payload);
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        console.log(action.payload);
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        console.log(action.payload);
      });

    builder
      .addCase(toggleAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleAvailability.fulfilled, (state, action) => {
        console.log(action.payload);
      });
  },
});

export default ProductSlice.reducer;
