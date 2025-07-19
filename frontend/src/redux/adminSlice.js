import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosIntsance"
import toast from "react-hot-toast";

export const fetchAdminData = createAsyncThunk(
  "admin/fetchData",
  async (tab, { rejectWithValue }) => {
    try {
      let response;
      if (tab === "users") {
        response = await axiosInstance.get("/api/admin/users");
        return { type: "users", data: response.data };
      } else if (tab === "blogs") {
        response = await axiosInstance.get("/api/admin/blogs");
        const transformedBlogs = response.data.map((blog) => ({
          _id: blog.id,
          title: blog.title,
          category: blog.category,
          date: blog.date,
          author: {
            username: blog.authorName || "Unknown",
          },
        }));
        return { type: "blogs", data: transformedBlogs };
      } else if (tab === "comments") {
        response = await axiosInstance.get("/api/admin/comments");
        const transformedComments = response.data.map((comment) => ({
          _id: comment.id,
          text: comment.content || '',
          date: comment.date,
          author: {
            username: comment.authorName || "Unknown",
          },
          post: {
            _id: comment.blogId,
            title: comment.blogTitle || "Untitled",
          },
        }));
        return { type: "comments", data: transformedComments };
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch data.");
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const deleteAdminItem = createAsyncThunk(
  "admin/deleteItem",
  async ({ itemType, itemId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/${itemType}s/${itemId}`);
      toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully!`);
      return { itemType: `${itemType}s`, itemId }; 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item.");
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    blogs: [],
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  fetchAdminData
      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        const { type, data } = action.payload;
        state[type] = data;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //  deleteAdminItem
      .addCase(deleteAdminItem.fulfilled, (state, action) => {
        const { itemType, itemId } = action.payload;
        state[itemType] = state[itemType].filter((item) => item._id !== itemId);
      })
      .addCase(deleteAdminItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;