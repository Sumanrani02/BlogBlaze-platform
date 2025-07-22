import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosIntsance";
import toast from "react-hot-toast";

//  Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/users/profile");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

//  Update profile (username & email)
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/api/users/profile",
        updatedData
      );
      toast.success("Profile updated successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to update profile.");
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

//  Change Password
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/api/users/change-password", {
        currentPassword,
        newPassword,
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password"
      );
    }
  }
);

//  Forgot Password
export const forgotPassword = createAsyncThunk(
  "profile/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/forgot-password", {
        email,
      });
      toast.success("Reset link sent to your email.");
      return response.data;
    } catch (err) {
      toast.error("Failed to send reset link.");
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset link"
      );
    }
  }
);

//  Reset Password
export const resetPassword = createAsyncThunk(
  "profile/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/auth/reset-password/${token}`,
        { password: newPassword }
      );
      toast.success("Password reset successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to reset password.");
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

//  Delete Account
export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/api/users/me");
      toast.success("Account deleted successfully.");
      return true;
    } catch (err) {
      toast.error("Failed to delete account.");
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete account"
      );
    }
  }
);

// Initial state
const initialState = {
  userProfile: null,
  loading: false,
  error: null,
  isPasswordChanged: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
    clearProfileData(state) {
      state.userProfile = null;
    },
    resetPasswordStatus(state) {
      state.isPasswordChanged = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userProfile = {
          ...state.userProfile,
          ...action.payload.user, 
        };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // changePassword
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isPasswordChanged = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteAccount
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.userProfile = null;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError, clearProfileData, resetPasswordStatus } =
  profileSlice.actions;
export default profileSlice.reducer;
