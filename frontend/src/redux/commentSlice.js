import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosIntsance";
import toast from "react-hot-toast";

//  Fetch user comments
export const fetchUserComments = createAsyncThunk(
  "comments/fetchUserComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/posts/user/comments");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch comments");
    }
  }
);

// commentSlice.js
export const postComment = createAsyncThunk(
  "comments/postComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/posts/${postId}/comments`, { comment: text });
      return response.data.comment;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to post comment");
    }
  }
);

//  Delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/posts/comments/${commentId}`);
      toast.success("Comment deleted successfully.");
      return commentId;
    } catch (err) {
      toast.error("Failed to delete comment.");
      return rejectWithValue(err.response?.data?.message || "Failed to delete comment");
    }
  }
);


export const likePost = createAsyncThunk(
  "comments/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/posts/${postId}/like`);
      return response.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to like post");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
     setComments(state, action) {
      state.comments = action.payload;
    },
    clearComments(state) {
      state.comments = [];
    }
  },
  extraReducers: (builder) => {
    builder

      // fetchUserComments
      .addCase(fetchUserComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchUserComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteComment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
       // POST Comment
      .addCase(postComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(postComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // Like Post
    .addCase(likePost.fulfilled, (state, action) => {
      state.lastLikeStatus = action.payload.liked;
      state.lastLikeCount = action.payload.likes.length;
    })
    .addCase(likePost.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});
export const { setComments, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
