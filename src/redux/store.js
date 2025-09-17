// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import loansReducer from "./loansSlice";

const store = configureStore({
  reducer: {
    loans: loansReducer,
  },
});

export default store;
