import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//Helper Function to load cart from local storage
const cartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
};

//Helper function to save cart to local storage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// ==========================
// Async Thunks
// ==========================

//Fetch cart for user or a guest
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async ({userId, guestId},{rejectWithValue}) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params: { userId, guestId }
                }
            );
            return response.data; // array of cart items
            
        } catch (error) {
            console.error('Error fetching cart:', error);
            return rejectWithValue(error.response.data);
        }
    });

//Add item to cart
export const addItemToCart = createAsyncThunk(
    'cart/addItemToCart',
    async ({ 
        userId, 
        guestId, 
        productId, 
        quantity,
        size,
        colour
     }, 
        { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                { userId, guestId, productId, quantity, size, colour}
            );
            return response.data; // updated cart item
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

//Update item quantity in cart
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ 
         productId,
         quantity,
         userId, 
         guestId, 
         size, 
         colour  }, 
         { rejectWithValue }) => {
            try {
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                    { productId, quantity, userId, guestId, size, colour }
                );
                return response.data; // updated cart item
            } catch (error) {
                console.error('Error updating cart item:', error);
                return rejectWithValue(error.response.data);
            }
    }
);

//Remove item from cart
export const removeItemFromCart = createAsyncThunk(
    'cart/removeItemFromCart',
    async ({ productId, userId, guestId, size, colour }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    data: { productId, userId, guestId, size, colour }
                }
            );
            return response.data; // updated cart after removal
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

// Merge guest cart with user cart upon login
 export const mergeCarts = createAsyncThunk(
    'cart/mergeCarts',
    async({ userId, guestId },{rejectWithValue})=>{
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
                { userId, guestId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                }
            );
            return response.data; // merged cart items
        } catch (error) {
            console.error('Error merging carts:', error);
            return rejectWithValue(error.response.data);
        }
    }
 );

// ==========================
// Initial State
// ==========================
const initialState = {
    cartItems: cartFromLocalStorage(),
    loading: false,
    error: null,
};

// Create Cart Slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem('cart');
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                saveCartToLocalStorage(state.cartItems);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch cart';
            })
            // Add Item to Cart
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                saveCartToLocalStorage(state.cartItems);
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add item to cart';
            })
            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                saveCartToLocalStorage(state.cartItems);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update cart item';
            })
            // Remove Item from Cart
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                saveCartToLocalStorage(state.cartItems);
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to remove item from cart';
            })
            // Merge Carts
            .addCase(mergeCarts.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(mergeCarts.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
                saveCartToLocalStorage(state.cartItems);
            })
            .addCase(mergeCarts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to merge carts';
            });
    },
});

// Export actions and reducer
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;










    

