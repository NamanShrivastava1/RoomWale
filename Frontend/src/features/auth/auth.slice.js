import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "./auth.api.js";
import { getPayload } from "../../lib/normalize.js";
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return getPayload(await authApi.me());
    } catch (e) {
      return rejectWithValue(
        e.response?.status === 401 ? "" : e.userMessage || "",
      );
    }
  },
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      return getPayload(await authApi.login(body));
    } catch (e) {
      return rejectWithValue(e.userMessage || "Unable to sign in");
    }
  },
);
export const registerUser = createAsyncThunk(
  "auth/register",
  async (body, { rejectWithValue }) => {
    try {
      return getPayload(await authApi.register(body));
    } catch (e) {
      return rejectWithValue(e.userMessage || "Unable to create account");
    }
  },
);
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch {}
  return true;
});
const slice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle", checking: true, error: null },
  reducers: {
    clearAuthError(s) {
      s.error = null;
    },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchMe.pending, (s) => {
        s.checking = true;
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.checking = false;
        s.user = a.payload?.user || a.payload?.data?.user || a.payload || null;
      })
      .addCase(fetchMe.rejected, (s) => {
        s.checking = false;
        s.user = null;
      })
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload?.user || a.payload?.data?.user || a.payload;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      .addCase(registerUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload?.user || a.payload?.data?.user || a.payload;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.status = "idle";
      }),
});
export const { clearAuthError } = slice.actions;
export default slice.reducer;
