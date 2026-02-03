import{createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

//Retrieving user info and token from localStorage(if available)
const userFormStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

//Check for existing guest ID from localStorage or generate a new one
const inititalGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", inititalGuestId);

//Initial state
const initialState = {
    user: userFormStorage,
    guestId: inititalGuestId,
    loading: false,
    error: null
};

//Async thunk for user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async(userData, {rejectWithValue})=>{
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
                userData
            )
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);
            return response.data.user; //Returning user object from the response
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Login failed");
        }
    }
);

//Async thunk for user registeration
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async(userData, {rejectWithValue})=>{
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
                userData
            )
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);
            return response.data.user; //Returning user object from the response
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Registration failed");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            state.user = null; // Clear user data on logout
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId); // Generate and store new guest ID
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId); // Generate and store new guest ID
        }
    },
    extraReducers: (builder) => {
        builder
            //Login user
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            //Register user
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

export const {logoutUser, generateNewGuestId} = authSlice.actions;
export default authSlice.reducer;


