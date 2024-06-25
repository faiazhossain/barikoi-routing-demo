import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface MapSlice {
  value: number;
  mouseEnteredMarker: object;
  search: object;
  previouslySelectedValue: string;
}

// Define the initial state using that type
const initialState: MapSlice = {
  value: 0,
  mouseEnteredMarker: {},
  previouslySelectedValue: "",
  search: [],
};

export const mapSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMouseEnteredMarker: (state, action) => {
      state.mouseEnteredMarker = action.payload;
    },
    setPreviouslySelectedValue: (state, action) => {
      state.previouslySelectedValue = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setMouseEnteredMarker, setPreviouslySelectedValue, setSearch } =
  mapSlice.actions;

export const selectMap = (state: RootState) => state.mainmap.value;

export default mapSlice.reducer;
