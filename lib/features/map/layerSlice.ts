import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface LayerSlice {
  osrmVanilla: Object;
  googleData: Object;
  osrmKenya: Object;
  selectLocationFrom: Object;
  selectLocationTo: Object;
}

// Define the initial state using that type
const initialState: LayerSlice = {
  osrmVanilla: {},
  googleData: {},
  osrmKenya: {},
  selectLocationFrom: {},
  selectLocationTo: {},
};

export const layerSlice = createSlice({
  name: "layerSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setOsrmVanilla: (state, action) => {
      state.osrmVanilla = action.payload;
    },
    setOsrmKenya: (state, action) => {
      state.osrmKenya = action.payload;
    },
    setGoogleData: (state, action) => {
      state.googleData = action.payload;
    },
    setSelectLocationFrom: (state, action) => {
      state.selectLocationFrom = action.payload;
    },
    setSelectLocationTo: (state, action) => {
      state.selectLocationTo = action.payload;
    },
  },
});

export const {
  setOsrmVanilla,
  setOsrmKenya,
  setGoogleData,
  setSelectLocationFrom,
  setSelectLocationTo,
} = layerSlice.actions;

export const selectMap = (state: RootState) => state.mainmap.value;

export default layerSlice.reducer;
