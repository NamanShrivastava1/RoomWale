import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tasksApi } from "./tasks.api.js";
import { getPayload, getArray } from "../../lib/normalize.js";
export const fetchTasks = createAsyncThunk(
  "tasks/list",
  async (roomId, { rejectWithValue }) => {
    try {
      return {
        roomId,
        items: getArray(getPayload(await tasksApi.list(roomId))),
      };
    } catch (e) {
      return rejectWithValue(e.userMessage || "Could not load tasks");
    }
  },
);
export const addTask = createAsyncThunk(
  "tasks/create",
  async ({ roomId, ...body }, { rejectWithValue }) => {
    try {
      return { roomId, item: getPayload(await tasksApi.create(roomId, body)) };
    } catch (e) {
      return rejectWithValue(e.userMessage || "Could not create task");
    }
  },
);
export const completeTask = createAsyncThunk(
  "tasks/complete",
  async ({ taskId, roomId, ...body }, { rejectWithValue }) => {
    try {
      await tasksApi.complete(taskId, body);
      return { taskId, roomId };
    } catch (e) {
      return rejectWithValue(e.userMessage || "Could not mark task complete");
    }
  },
);
const slice = createSlice({
  name: "tasks",
  initialState: {
    itemsByRoom: {},
    status: "idle",
    error: null,
    mutationStatus: "idle",
    notice: null,
  },
  reducers: {
    clearTaskError(s) {
      s.error = null;
      s.notice = null;
    },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchTasks.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchTasks.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.itemsByRoom[a.payload.roomId] = a.payload.items;
      })
      .addCase(fetchTasks.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })
      .addCase(addTask.pending, (s) => {
        s.mutationStatus = "loading";
        s.error = null;
      })
      .addCase(addTask.fulfilled, (s, a) => {
        s.mutationStatus = "idle";
        const item = a.payload.item?.task || a.payload.item;
        s.itemsByRoom[a.payload.roomId] ||= [];
        if (item) s.itemsByRoom[a.payload.roomId].unshift(item);
      })
      .addCase(addTask.rejected, (s, a) => {
        s.mutationStatus = "idle";
        s.error = a.payload;
      })
      .addCase(completeTask.pending, (s) => {
        s.mutationStatus = "loading";
        s.error = null;
        s.notice = null;
      })
      .addCase(completeTask.fulfilled, (s, a) => {
        s.mutationStatus = "idle";
        s.notice = "Nice one — logged!";
      })
      .addCase(completeTask.rejected, (s, a) => {
        s.mutationStatus = "idle";
        s.error = a.payload;
      }),
});
export const { clearTaskError } = slice.actions;
export default slice.reducer;
