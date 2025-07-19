import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as jwtDecode from 'jwt-decode';

const getInitialAuthState = () => {
  try {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      const decoded = jwtDecode.default(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expired, clearing auth...");
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return {
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        };
      }

      return {
        user: JSON.parse(user),
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (e) {
    console.error("Failed to load or decode auth state:", e);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", userData);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk for Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", userData);
      return response.data.message || "Registration successful!";
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: getInitialAuthState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
