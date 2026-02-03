import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateOrderDeliveryStatus, deleteOrder } from '../../redux/slices/adminOrdersSlice';
import { FiTrash2 } from "react-icons/fi";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleOrderStatus = (orderId, newStatus) => {
    dispatch(updateOrderDeliveryStatus({ orderId, status: newStatus }));
  };

  const handleDelete = (orderId) => {
    if (confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(orderId));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) return <p className="p-6 text-center">Loading orders…</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Order Management</h2>

      {/* 📱 Mobile View */}
      <div className="sm:hidden space-y-4">
        {orders?.map((order) => (
          <div key={order._id} className="p-4 bg-white rounded-md shadow border">
            
            <div className="flex justify-between">
              <p className="text-sm font-semibold">#{order._id.slice(-6)}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-3">
              <p className="text-sm"><b>User:</b> {order?.user?.username || "Unknown"}</p>
              <p className="text-sm"><b>Total:</b> ₹{order.totalPrice.toFixed(2)}</p>
            </div>

            <div className="flex gap-2 mt-4">

              {/* Mobile Dropdown */}
              <select
                className="w-full px-3 py-2 border rounded"
                value={order.status}
                onChange={(e) => handleOrderStatus(order._id, e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Mobile Icon Delete */}
              <button
                className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center justify-center"
                onClick={() => handleDelete(order._id)}
              >
                <FiTrash2 size={18} />
              </button>

            </div>

          </div>
        ))}
      </div>

      {/* 💻 Desktop Table */}
      <div className="hidden sm:block overflow-x-auto shadow border rounded-lg">
        <table className="min-w-full table-auto text-left text-sm">
          
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="py-3 px-4 w-40 whitespace-nowrap">Order ID</th>
              <th className="py-3 px-4 w-32 whitespace-nowrap">User</th>
              <th className="py-3 px-4 w-28 whitespace-nowrap">Total</th>
              <th className="py-3 px-4 w-20 whitespace-nowrap">Paid</th>
              <th className="py-3 px-4 w-28 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 w-40 whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders?.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                
                <td className="py-3 px-4 text-xs break-all">{order._id}</td>

                <td className="py-3 px-4 text-sm truncate max-w-[120px]">
                  {order?.user?.username || "Unknown"}
                </td>

                <td className="py-3 px-4 whitespace-nowrap">₹{order.totalPrice.toFixed(2)}</td>

                <td className="py-3 px-4 whitespace-nowrap">{order.isPaid ? "Yes" : "No"}</td>

                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                {/* ⭐ Perfect Action Layout */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">

                    {/* Status Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                      className="h-9 w-32 px-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Icon-only delete button */}
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="h-9 w-9 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      title="Delete Order"
                    >
                      <FiTrash2 size={18} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {orders?.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
};

export default OrderManagement;
