import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import blogReducer from "./blogSlice";
import commentReducer from "./commentSlice";
import profileReducer from "./profileSlice";
import adminReducer from "./adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    comments: commentReducer,
    profile: profileReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
