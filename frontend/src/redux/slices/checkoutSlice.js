import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunks
export const createCheckoutSession = createAsyncThunk(
  "checkout/createCheckoutSession", // action type prefix
  async ({ checkoutItems, shippingAddress, paymentMethod, totalPrice }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        {
          checkoutItems,
          shippingAddress,
          paymentMethod,
          totalPrice,
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error creating checkout session:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async Thunk to update checkout payment status
export const updateCheckoutToPaid = createAsyncThunk(
    "checkout/updateCheckoutToPaid", // action type prefix
    async ({ checkoutId, paymentStatus, paymentDetails }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                {
                    paymentStatus,
                    paymentDetails,
                },
                 {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
            );

            return response.data;
        }
        catch (error) {
            console.error("❌ Error updating checkout to paid:", error);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
 
// Async thnunk to finalize checkout
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async ({ checkoutId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {}, // body is empty
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error finalizing checkout:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);


// Slices
const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkoutData: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetCheckoutState: (state) => {
            state.checkoutData = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Create Checkout Session
        .addCase(createCheckoutSession.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckoutSession.fulfilled, (state, action)=>{
            state.loading = false;
            state.checkoutData = action.payload;
        })
        .addCase(createCheckoutSession.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        // Update Checkout to Paid
        .addCase(updateCheckoutToPaid.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCheckoutToPaid.fulfilled, (state, action)=>{
            state.loading = false;
            state.checkoutData = action.payload;
        })
        .addCase(updateCheckoutToPaid.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        // Finalize Checkout
        .addCase(finalizeCheckout.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(finalizeCheckout.fulfilled, (state, action)=>{
            state.loading = false;
            state.checkoutData = action.payload;
        })
        .addCase(finalizeCheckout.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
    



