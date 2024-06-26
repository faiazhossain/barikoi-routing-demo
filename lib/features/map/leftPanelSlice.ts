import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface LeftPanelSlice {
  selectAutocompleteData: object;
}

// Define the initial state using that type
const initialState: LeftPanelSlice = {
  selectAutocompleteData: {},
};

export const leftPanelSlice = createSlice({
  name: "leftPanel",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSelectAutocompleteData: (state, action) => {
      state.selectAutocompleteData = action.payload;
    },
  },
});

export const { setSelectAutocompleteData } = leftPanelSlice.actions;

export const selectMap = (state: RootState) => state.mainmap.value;

export default leftPanelSlice.reducer;
