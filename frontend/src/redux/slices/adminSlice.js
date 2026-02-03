import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

// =======================
// FETCH USERS
// =======================
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// =======================
// CREATE USER
// =======================
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/users/add`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// =======================
// UPDATE USER
// =======================
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/users/${id}`, updates, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// =======================
// DELETE USER
// =======================
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.users = a.payload;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // CREATE
      .addCase(createUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createUser.fulfilled, (s, a) => {
        s.loading = false;
        s.users.push(a.payload);
      })
      .addCase(createUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // UPDATE
      .addCase(updateUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.users.findIndex((u) => u._id === a.payload._id);
        if (idx !== -1) s.users[idx] = a.payload;
      })
      .addCase(updateUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // DELETE
      .addCase(deleteUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.loading = false;
        s.users = s.users.filter((u) => u._id !== a.payload);
      })
      .addCase(deleteUser.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export default adminSlice.reducer;
