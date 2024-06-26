import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./features/map/mapSlice";
import leftPanelSlice from "./features/map/leftPanelSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      mainmap: mapSlice,
      leftPanel: leftPanelSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
