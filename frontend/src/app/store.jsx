import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../features/authSlice";

export let store = configureStore({
  reducer: {
    auth: userSlice.reducer,
  },
});
