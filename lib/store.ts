import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./features/map/mapSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      mainmap: mapSlice, // Add the reducer here
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
