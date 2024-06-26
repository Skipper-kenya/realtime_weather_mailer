import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loading";
import userReducer from "./user";
import preferenceReducer from "./preference";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    user: userReducer,
    preference: preferenceReducer,
  },
});

export default store;
