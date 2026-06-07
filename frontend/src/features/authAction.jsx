import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (credentials, thunkApi) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data.user;
    } catch (error) {
      return thunkApi.rejectWithValue("login failed");
    }
  },
);
