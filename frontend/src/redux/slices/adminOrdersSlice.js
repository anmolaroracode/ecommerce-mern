import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Fetch all admin orders
export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update delivery status
export const updateOrderDeliveryStatus = createAsyncThunk(
  "adminOrders/updateOrderDeliveryStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;

        // ✅ Update totals here
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Delivery Status
      .addCase(updateOrderDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;

        const updatedOrder = action.payload.order;

        // Replace in state
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );

        // 🔁 Recalculate totals after update
        state.totalOrders = state.orders.length;
        state.totalSales = state.orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
      })
      .addCase(updateOrderDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;

        // ⚠ FIXED: use _id
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );

        // 🔁 Update totals after delete
        state.totalOrders = state.orders.length;
        state.totalSales = state.orders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminOrdersSlice.reducer;
