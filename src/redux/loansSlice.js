// src/redux/loansSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Async thunk - fetch loans dataset.
 * Replace the URL below if HR gave a different raw link.
 */
export const fetchLoans = createAsyncThunk(
  "loans/fetchLoans",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/rahulsoni-data/data/refs/heads/main/data.json"
      );
      if (!res.ok) {
        // return rejectWithValue so extraReducer sees payload
        return thunkAPI.rejectWithValue("Failed to fetch data");
      }
      const data = await res.json();
      return data; // expecting array of loan objects
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Network error");
    }
  }
);

const loansSlice = createSlice({
  name: "loans",
  initialState: {
    items: [],     // array of records
    loading: false,
    error: null,
  },
  reducers: {
    // add synchronous reducers here if needed later
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Error";
      });
  },
});

export default loansSlice.reducer;
