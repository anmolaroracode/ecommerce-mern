import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAdminOrders } from '../redux/slices/adminOrdersSlice';

const AdminHomepage = () => {
  const dispatch = useDispatch();
  
  const { products } = useSelector((state) => state.adminProducts);
  const { orders, totalOrders, totalSales } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  // Sort Recent Orders (Latest First)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">{status}</span>
      case 'Processing':
        return <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">{status}</span>
      case 'Cancelled':
        return <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">{status}</span>
      default:
        return <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">{status}</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Revenue */}
        <div className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold text-gray-600">Revenue</h2>
          <p className="text-3xl font-bold mt-2">₹{totalSales?.toLocaleString()}</p>
        </div>

        {/* Total Orders */}
        <div className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 text-sm hover:underline mt-2 inline-block">
            Manage Orders
          </Link>
        </div>

        {/* Total Products */}
        <div className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
          <p className="text-3xl font-bold mt-2">{products?.length}</p>
          <Link to="/admin/products" className="text-blue-500 text-sm hover:underline mt-2 inline-block">
            Manage Products
          </Link>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 text-sm uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedOrders.slice(0, 5).map((order, idx) => (
                <tr
                  key={order._id}
                  className={`text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="py-3 px-4 font-medium">{order._id}</td>
                  <td className="py-3 px-4">{order.user?.username || "Unknown User"}</td>
                  <td className="py-3 px-4 font-semibold">₹{order.totalPrice}</td>
                  <td className="py-3 px-4">
                    {order.isPaid ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;
