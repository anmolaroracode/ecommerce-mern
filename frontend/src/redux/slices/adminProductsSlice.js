import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = localStorage.getItem('userToken');

// Async thunk to fetch all products for admin
export const fetchAdminProducts = createAsyncThunk(
    'adminProducts/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/products`,
                {
                    headers:{
                        Authorization: `Bearer ${USER_TOKEN}`
                    }
                }
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to create a new product
export const createAdminProduct = createAsyncThunk(
    'adminProducts/createAdminProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/admin/products`, productData,
                {
                    headers:{
                        Authorization: `Bearer ${USER_TOKEN}`
                    }
                }
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//Async thunk to update an existing product
export const updateAdminProduct = createAsyncThunk(
    'adminProducts/updateAdminProduct',
    async ({ productId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/api/admin/products/${productId}`, updatedData,
                {
                    headers:{
                        Authorization: `Bearer ${USER_TOKEN}`
                    }
                }
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk to delete a product
export const deleteAdminProduct = createAsyncThunk(
    'adminProducts/deleteAdminProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/api/admin/products/${productId}`,
                {
                    headers:{
                        Authorization: `Bearer ${USER_TOKEN}`
                    }
                }
            );
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const adminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        //Fetch Admin Products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            }
            )
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            )
        //Create Admin Product
            .addCase(createAdminProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(createAdminProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            }
            )
            .addCase(createAdminProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            )
        //Update Admin Product
            .addCase(updateAdminProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(updateAdminProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(product => product._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            }
            )
            .addCase(updateAdminProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            )
        //Delete Admin Product
            .addCase(deleteAdminProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(deleteAdminProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product._id !== action.payload._id);
            }
            )
            .addCase(deleteAdminProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            );
    }
});
export default adminProductsSlice.reducer;

