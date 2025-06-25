import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getInitialAuthState = () => {
  try {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user'); 
    if (token && user) {
      return {
        user: JSON.parse(user), 
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (e) {
    console.error("Failed to load auth state from localStorage:", e);
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

// Async Thunk for User Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", 
        userData
      );
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      return response.data.user; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register", 
        userData
      );
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
    // Action to handle user logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false; 
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user'); 
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle loginUser async thunk lifecycle
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
        localStorage.removeItem('jwtToken'); 
        localStorage.removeItem('user'); 
      })
      // Handle registerUser async thunk lifecycle
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { logout, setError, clearError } = authSlice.actions; 
export default authSlice.reducer;
