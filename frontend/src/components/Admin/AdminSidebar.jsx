import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    try {
      e?.preventDefault();
      dispatch(logoutUser());
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside
      className="p-6 w-64 flex-shrink-0 bg-gray-900 text-white"
      style={{ minWidth: 250, height: '100vh' }}
    >
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-bold text-white">
          Aura
        </Link>
      </div>

      <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded flex items-center"
          }
        >
          <FaUser className="inline mr-2" />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded flex items-center"
          }
        >
          <FaBoxOpen className="inline mr-2" />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded flex items-center"
          }
        >
          <FaClipboardList className="inline mr-2" />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white px-4 py-2 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded flex items-center"
          }
        >
          <FaStore className="inline mr-2" />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded py-2 px-4 flex items-center justify-center space-x-2"
          type="button"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
