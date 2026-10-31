import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { roomsApi } from "./rooms.api.js";
import { getPayload, getArray } from "../../lib/normalize.js";
export const fetchRooms = createAsyncThunk(
  "rooms/list",
  async (_, { rejectWithValue }) => {
    try {
      return getArray(getPayload(await roomsApi.list()));
    } catch (e) {
      return rejectWithValue(e.userMessage || "Could not load rooms");
    }
  },
);
export const createRoom = createAsyncThunk(
  "rooms/create",
  async (body, { rejectWithValue }) => {
    try {
      return getPayload(await roomsApi.create(body));
    } catch (e) {
      return rejectWithValue(e.userMessage || "Could not create room");
    }
  },
);
export const joinRoom = createAsyncThunk(
  "rooms/join",
  async (code, { rejectWithValue }) => {
    try {
      return getPayload(await roomsApi.join(code));
    } catch (e) {
      return rejectWithValue(e.userMessage || "Could not join room");
    }
  },
);
const slice = createSlice({
  name: "rooms",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    mutationStatus: "idle",
  },
  reducers: {
    clearRoomError(s) {
      s.error = null;
    },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchRooms.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchRooms.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchRooms.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      .addCase(createRoom.pending, (s) => {
        s.mutationStatus = "loading";
        s.error = null;
      })
      .addCase(createRoom.fulfilled, (s, a) => {
        s.mutationStatus = "idle";
        const room = a.payload?.room || a.payload;
        s.items.unshift(room);
      })
      .addCase(createRoom.rejected, (s, a) => {
        s.mutationStatus = "idle";
        s.error = a.payload;
      })
      .addCase(joinRoom.pending, (s) => {
        s.mutationStatus = "loading";
        s.error = null;
      })
      .addCase(joinRoom.fulfilled, (s, a) => {
        s.mutationStatus = "idle";
        const room = a.payload?.room || a.payload;
        if (room?._id) s.items.unshift(room);
      })
      .addCase(joinRoom.rejected, (s, a) => {
        s.mutationStatus = "idle";
        s.error = a.payload;
      }),
});
export const { clearRoomError } = slice.actions;
export default slice.reducer;
