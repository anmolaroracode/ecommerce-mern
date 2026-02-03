import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../redux/slices/adminSlice";
import { toast } from "sonner";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.admin);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      return toast.error("All fields are required");
    }

    if (editingUser) {
      dispatch(
        updateUser({
          id: editingUser._id,
          updates: {
            username: formData.username,
            email: formData.email,
            role: formData.role,
          },
        })
      ).then(() => {
        toast.success("User updated");
        setEditingUser(null);
        setFormData({ username: "", email: "", password: "", role: "user" });
      });
    } else {
      if (!formData.password) return toast.error("Password required");

      dispatch(createUser(formData)).then(() => {
        toast.success("User created");
        setFormData({ username: "", email: "", password: "", role: "user" });
      });
    }
  };

  const startEditing = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      email: u.email,
      password: "",
      role: u.role,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-4 text-center sm:text-left">
        User Management
      </h1>

      {/* FORM CARD */}
      <div className="bg-white shadow rounded p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingUser ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Username */}
          <input
            className="border p-2 rounded"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          {/* Email */}
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          {/* Password (ONLY on Add) */}
          {!editingUser && (
            <input
              className="border p-2 rounded sm:col-span-2"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          )}

          {/* Role */}
          <select
            className="border p-2 rounded sm:col-span-2"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Buttons */}
          <div className="sm:col-span-2 flex gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              type="submit"
            >
              {editingUser ? "Update User" : "Create User"}
            </button>

            {editingUser && (
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    role: "user",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* USERS LIST */}
      <div className="bg-white shadow rounded p-5">
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        {loading && <p className="text-center py-3">Loading...</p>}

        {/* MOBILE VIEW – CARDS */}
        <div className="sm:hidden space-y-4">
          {users.map((u) => (
            <div key={u._id} className="border rounded p-4 shadow-sm">
              <p><span className="font-semibold">Username:</span> {u.username}</p>
              <p><span className="font-semibold">Email:</span> {u.email}</p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                <span
                  className={`px-2 py-1 text-white rounded ${
                    u.role === "admin" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {u.role}
                </span>
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  className="w-full bg-yellow-500 text-white py-1 rounded"
                  onClick={() => startEditing(u)}
                >
                  Edit
                </button>

                <button
                  className="w-full bg-red-500 text-white py-1 rounded"
                  onClick={() => dispatch(deleteUser(u._id))}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW – TABLE */}
        <table className="hidden sm:table w-full border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-2 border">{u.username}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      u.role === "admin" ? "bg-red-500" : "bg-green-500"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="p-2 border space-x-3">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => startEditing(u)}
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => dispatch(deleteUser(u._id))}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
