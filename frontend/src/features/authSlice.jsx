import { createSlice } from "@reduxjs/toolkit";

export let userSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      ((state.isAuthenticated = true), (state.isLoading = false));
    },
    setLoadingFalse: (state) => {
      state.isLoading = false;
    },
  },
});

export let { addUser, setLoadingFalse } = userSlice.actions;
