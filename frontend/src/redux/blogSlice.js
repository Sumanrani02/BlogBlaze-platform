import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosIntsance";

// Fetch all posts
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/api/posts");
      return res.data.blogs || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog"
      );
    }
  }
);
//  getusersPost
export const getUserBlogs = createAsyncThunk(
  "blogs/getUserBlogs",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/posts/user");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user blogs"
      );
    }
  }
);

// Fetch by id
export const fetchBlogById = createAsyncThunk(
  "blogs/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/posts/${id}`);
      return res.data.blog || res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog"
      );
    }
  }
);

// Create Blog
export const createBlog = createAsyncThunk(
  "blogs/create",
  async (blogData, thunkAPI) => {
    try {
      const isFormData = blogData instanceof FormData;

      const config = {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      };

      const res = await axiosInstance.post("/api/posts", blogData, config);
      return res.data.blog || res.data;
    } catch (error) {
      console.log("API error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to create blog post"
      );
    }
  }
);

//  Featured Posts
export const fetchFeaturedPosts = createAsyncThunk(
  "blogs/fetchFeaturedPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/posts/featured");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured posts"
      );
    }
  }
);

//  Recent Posts
export const fetchRecentPosts = createAsyncThunk(
  "blogs/fetchRecentPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/api/posts/recent");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent posts"
      );
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async (postId, thunkAPI) => {
    try {
      await axiosInstance.delete(`api/posts/${postId}`);
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete blog"
      );
    }
  }
);

export const subscribeToNewsletter = createAsyncThunk(
  "blogs/subscribeToNewsletter",
  async (email, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/api/newsletter/subscribe", {
        email,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Subscription failed"
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    blog: null,
    featured: [],
    recent: [],
    loading: false,
    error: null,
    successMessage: null,
    newsletterLoading: false,
    newsletterSuccess: false,
    newsletterError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single post
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
        state.successMessage = "Blog post created successfully!";
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //  getUserBlogs
      .addCase(getUserBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(getUserBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Featured posts
      .addCase(fetchFeaturedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Recent posts
      .addCase(fetchRecentPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload;
      })
      .addCase(fetchRecentPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // newsletter
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.newsletterLoading = true;
        state.newsletterSuccess = false;
        state.newsletterError = null;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state) => {
        state.newsletterLoading = false;
        state.newsletterSuccess = true;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.newsletterLoading = false;
        state.newsletterError = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = blogSlice.actions;
export default blogSlice.reducer;
