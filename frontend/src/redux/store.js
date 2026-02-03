import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // adjust path
import productsReducer from './slices/productsSlice'; // adjust path
import cartReducer from './slices/cartSlice'; // adjust path
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice'; // adjust path if needed
import adminProductReducer from './slices/adminProductsSlice'; // adjust path if needed
import adminOrdersReducer from './slices/adminOrdersSlice'; // adjust path if needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrdersReducer,
  },
});

export default store;
