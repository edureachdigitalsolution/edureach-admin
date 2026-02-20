import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { leadsApi } from "../features/leads/leadsApi";

export const store = configureStore({
  reducer: {
    // 🔐 Auth slice
    auth: authReducer,

    // 🌐 RTK Query API slice
    [leadsApi.reducerPath]: leadsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leadsApi.middleware),

  devTools: true,
});