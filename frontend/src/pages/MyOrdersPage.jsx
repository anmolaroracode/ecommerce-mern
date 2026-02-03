import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';

// Mask last 4 digits of Order ID
const maskOrderId = (id) => {
  if (!id) return "";
  return "****" + id.slice(-4);
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <div className="text-center p-6">Loading orders...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      {/* Mobile Cards */}
      <div className="space-y-4 sm:hidden">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(order._id)}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={order.items[0].image}
                  alt={order.items[0].name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    Order #{maskOrderId(order._id)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-700">
                    {`${order.shippingAddress.city}, ${order.shippingAddress.country}`}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm font-medium">
                  ${order.totalPrice.toFixed(2)}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    order.isDelivered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.isDelivered ? 'Delivered' : 'Pending'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No orders found</p>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block relative shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full text-left text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Order Id</th>
              <th className="py-2 px-4">Created At</th>
              <th className="py-2 px-4">Shipping Address</th>
              <th className="py-2 px-4">Items</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b font-semibold hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(order._id)}
                >
                  <td className="py-2 px-4">
                    <img
                      src={order.items[0].image}
                      alt={order.items[0].name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>

                  <td className="py-2 px-4">#{maskOrderId(order._id)}</td>

                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-2 px-4">
                    {`${order.shippingAddress.city}, ${order.shippingAddress.country}`}
                  </td>

                  <td className="py-2 px-4">{order.items.length}</td>

                  <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td>

                  <td className="py-2 px-4">
                    <span
                       className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                    }`}
                    >
                        {order.status}
                    </span>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-6 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {orders.length > 0 && (
        <div className="p-4 bg-gray-50 text-right text-sm sm:text-base">
          <span className="font-semibold">Total Orders: {orders.length}</span>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
