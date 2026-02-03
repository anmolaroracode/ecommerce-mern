import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchOrderById } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { orderDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  if (loading || !orderDetails) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-xl">
        Loading order details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-emerald-700 mb-6 sm:mb-8">
        Order Details
      </h1>

      <div className="p-4 sm:p-6 rounded-lg border space-y-6">

        {/* Order ID & Status */}
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              Order ID: <span>{orderDetails._id}</span>
            </h2>
            <p className="text-gray-500">
              Order Date:{" "}
              {new Date(orderDetails.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div className="space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                orderDetails.isPaid
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {orderDetails.isPaid ? "Paid" : "Not Paid"}
            </span>

            <span
              className={`px-2 py-1 rounded-full text-sm ${
                orderDetails.isDelivered
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {orderDetails.isDelivered ? "Delivered" : "Not Delivered"}
            </span>
          </div>
        </div>

        {/* Shipping */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
          <p>{orderDetails.shippingAddress.address}</p>
          <p>
            {orderDetails.shippingAddress.city},{" "}
            {orderDetails.shippingAddress.postalCode}
          </p>
          <p>{orderDetails.shippingAddress.country}</p>
        </div>

        {/* Payment */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
          <p>{orderDetails.paymentMethod}</p>
        </div>

        {/* ORDER ITEMS */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Order Items</h3>

          {(orderDetails.items || []).map((item) => (
            <div
              key={item._id || item.productId || `${item.name}-${Math.random()}`}
              className="flex flex-col sm:flex-row border rounded-lg p-4"
            >
              <img
                src={item.image}
                className="w-24 h-24 rounded-md mb-3 sm:mb-0"
              />

              <div className="flex-1 sm:ml-4">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">Color: {item.color}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>

                <div className="flex justify-between mt-2">
                  <p>Qty: {item.quantity}</p>
                  <p className="font-semibold">${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="text-right">
          <h3 className="text-xl font-semibold">
            Total Amount: $
            {orderDetails.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
          </h3>
        </div>

        <div className="pt-4 text-center">
          <Link
            to="/my-orders"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700"
          >
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
