import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ==========================
// Async Thunks
// ==========================

// Fetch products based on filters
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${queryParams.toString()}`
    );
    return response.data; // array of products
  }
);

// Fetch single product details
export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`
    );
    return response.data; // single product object
  }
);

// Update a product and fetch its directly linked/related products
export const updateProductAndFetchRelations = createAsyncThunk(
  'products/updateProductAndFetchRelations',
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken') || ''}`
        }
      }
    );
    return response.data; // updated product or related products
  }
);

// Fetch recommended/similar products
export const fetchRecommendedProducts = createAsyncThunk(
  'products/fetchRecommendedProducts',
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data; // array of similar/recommended products
  }
);

// Fetch products by collection
export const fetchProductsByCollection = createAsyncThunk(
  'products/fetchProductsByCollection',
  async (collection) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/collections/${collection}`
    );
    return response.data; // array of products in the collection
  }
);



// ==========================
// Initial State
// ==========================
const initialState = {
  products: [],
  selectedProduct: null,
  recommendedProducts: [],
  loading: {
    products: false,
    selectedProduct: false,
    updateProduct: false,
    recommendedProducts: false,
  },
  error: {
    products: null,
    selectedProduct: null,
    updateProduct: null,
    recommendedProducts: null,
  },
  filters: {
    category: '',
    size: '',
    colour: '',
    gender: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: '',
    search: '',
    material: '',
    collection: ''
  }
};

// ==========================
// Slice
// ==========================
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      Object.keys(state.filters).forEach((key) => (state.filters[key] = ''));
    }
  },
  extraReducers: (builder) => {
    // --------- fetchProducts ---------
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.error.message;
      });

    // --------- fetchProductDetails ---------
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading.selectedProduct = true;
        state.error.selectedProduct = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading.selectedProduct = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading.selectedProduct = false;
        state.error.selectedProduct = action.error.message;
      });

    // --------- updateProductAndFetchRelations ---------
    builder
      .addCase(updateProductAndFetchRelations.pending, (state) => {
        state.loading.updateProduct = true;
        state.error.updateProduct = null;
      })
      .addCase(updateProductAndFetchRelations.fulfilled, (state, action) => {
        state.loading.updateProduct = false;
        const updatedProduct = action.payload;

        // Update in products array if exists
        const index = state.products.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) state.products[index] = updatedProduct;
      })
      .addCase(updateProductAndFetchRelations.rejected, (state, action) => {
        state.loading.updateProduct = false;
        state.error.updateProduct = action.error.message;
      });

    // --------- fetchRecommendedProducts ---------
    builder
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.loading.recommendedProducts = true;
        state.error.recommendedProducts = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.loading.recommendedProducts = false;
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.loading.recommendedProducts = false;
        state.error.recommendedProducts = action.error.message;
      });

    }
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
