import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
//import {thunk} from "redux-thunk";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;