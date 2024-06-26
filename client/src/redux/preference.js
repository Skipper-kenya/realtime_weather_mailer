import { createSlice } from "@reduxjs/toolkit";

const preferenceSlice = createSlice({
  name: "preference",
  initialState: {
    _id: "",
    _v: 0,
    createdAt: "",
    updatedAt: "",
    email: "",
    location: "",
    preference: "",
  },

  reducers: {
    updatePreference: (state, action) => {
      return action.payload;
    },
  },
});

export const { updatePreference } = preferenceSlice.actions;

export default preferenceSlice.reducer;
