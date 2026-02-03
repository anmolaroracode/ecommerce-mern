import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Homee';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import { Toaster } from 'sonner'
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomepage from './pages/AdminHomepage';
import UserManagement from './components/Admin/UserManagement';
import ProductsManagement from './components/Admin/ProductsManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import {Provider} from 'react-redux';
import store from './redux/store';


const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="products" element={<CollectionPage />} />
        <Route path="collections/:collection" element={<CollectionPage />} />
        <Route path="product/:id" element={<ProductDetails/>} />
        <Route path="checkout" element={<Checkout/>} />
        <Route path="order-confirmation" element={<OrderConfirmationPage/>} />
        <Route path="order/:id" element={<OrderDetailsPage/>} />
        <Route path="my-orders" element={<Profile/>} />
      </Route>
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminLayout/>
        </ProtectedAdminRoute>
      }>
        {/* {Admin layout} */}
         <Route index element={<AdminHomepage/>}/>
         <Route path="users" element={<UserManagement/>}/>
         <Route path="products" element={<ProductsManagement/>}/>
         <Route path="products/:id/edit" element={<EditProductPage/>}/>
         <Route path="/admin/products/add" element={<EditProductPage />} />
         <Route path="orders" element={<OrderManagement/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </Provider>
  )
}

export default App

