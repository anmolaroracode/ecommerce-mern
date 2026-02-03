// src/pages/OrderConfirmationPage.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchOrderById } from "../redux/slices/orderSlice";

const OrderConfirmationPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector((state) => state.order);

  // Fetch order from backend using orderId
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [orderId, dispatch]);

  const calculateEstimatedDelivery = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Loading Screen
  if (loading || !orderDetails) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-xl">
        Loading your order...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-emerald-700 mb-6 sm:mb-8">
        Thank You For Your Order
      </h1>

      <div className="p-4 sm:p-6 rounded-lg border space-y-6">
        
        {/* Order ID & Delivery */}
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Order ID: <span className="font-normal">{orderDetails._id}</span>
            </h2>
            <p className="text-gray-500">
              Order Date:{" "}
              <span className="font-normal">
                {new Date(orderDetails.createdAt).toLocaleDateString("en-GB")}
              </span>
            </p>
          </div>

          <p className="text-emerald-700">
            Estimated Delivery:{" "}
            {calculateEstimatedDelivery(orderDetails.createdAt)}
          </p>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          {(orderDetails.items || []).map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-start sm:items-center border rounded-lg p-4 hover:shadow-sm transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-md mb-3 sm:mb-0"
              />

              <div className="flex-1 sm:ml-4">
                <h4 className="text-base font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">Colour: {item.color}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>

                <div className="flex justify-between mt-2">
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-md font-semibold">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
          <p className="text-gray-700">{orderDetails.shippingAddress.address}</p>
          <p className="text-gray-700">
            {orderDetails.shippingAddress.city},{" "}
            {orderDetails.shippingAddress.postalCode}
          </p>
          <p className="text-gray-700">{orderDetails.shippingAddress.country}</p>
        </div>

        {/* Payment Info */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Payment Information</h3>
          <p className="text-gray-700">
            <strong>Status:</strong> {orderDetails.paymentStatus}
          </p>
          <p className="text-gray-700">
            <strong>Paid via:</strong> {orderDetails.paymentMethod}
          </p>
        </div>

        {/* Total Amount */}
        <div className="text-right">
          <h3 className="text-xl font-semibold">
            Total Amount: ₹{orderDetails.totalPrice}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
