import axios from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";
// import { message } from "antd";
import { API } from "@/app.config";
import { setSearch } from "../map/mapSlice";
import { setOsrmKenya, setOsrmVanilla } from "../map/layerSlice";

export const handleSearchPlacesSelectedCountry = createAsyncThunk(
  "search/searchPlaces",
  async ({ value, minLon, minLat, maxLon, maxLat }: any, { dispatch }) => {
    try {
      const url = `${API.AUTOCOMPLETE_SPECIFIC_COUNTRY}${value}&boundary.rect.min_lon=${minLon}&boundary.rect.min_lat=${minLat}&boundary.rect.max_lon=${maxLon}&boundary.rect.max_lat=${maxLat}`;
      const res = await axios.get(url);
      const results: any[] = res?.data?.features;
      const newOptions: any = results?.map((result: any) => ({
        ...result,
        key: result?.properties.id,
        value: result?.properties.name,
        label: result?.properties.label,
        longitude: Number(result?.geometry?.coordinates[0]),
        latitude: Number(result?.geometry?.coordinates[1]),
      }));
      dispatch(setSearch(newOptions));
    } catch (err) {
      console.error(err);
    }
  }
);

export const handleDistanceForOsrmVanilla = createAsyncThunk(
  "search/searchPlaces",

  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const res = await axios.get(
        `https://routing.openstreetmap.de/routed-car/route/v1/driving/${selectLocationFrom?.longitude},${selectLocationFrom?.latitude};${selectLocationTo?.longitude},${selectLocationTo?.latitude}?geometries=geojson&overview=full`
      );
      dispatch(setOsrmVanilla(res?.data));
    } catch (err) {
      console.error(err);
    }
  }
);

export const handleDistanceForOsrmKenya = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const res = await axios.get(
        `https://kenya.barikoimaps.dev/route/v1/car/${selectLocationFrom?.longitude},${selectLocationFrom?.latitude};${selectLocationTo?.longitude},${selectLocationTo?.latitude}?geometries=geojson&overview=full`
      );
      dispatch(setOsrmKenya(res?.data));
    } catch (err) {
      console.error(err);
    }
  }
);
