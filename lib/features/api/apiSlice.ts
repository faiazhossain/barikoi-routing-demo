import axios from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";
// import { message } from "antd";
import { API } from "@/app.config";
import { setBbox, setSearch } from "../map/mapSlice";
import { setGoogleData, setOsrmKenya, setOsrmVanilla } from "../map/layerSlice";
import { messageError } from "@/components/AlertMessage";
var polyline = require("@mapbox/polyline");

export const handleBbox = createAsyncThunk(
  "search/searchPlaces",
  async ({}, { dispatch }) => {
    try {
      const url = `${API.BBOX}`;
      const res = await axios.get(url);
      const results: any[] = res?.data?.items;
      const formatedResults: any = {
        minLat: results[0]?.bbox?.minLat,
        minLon: results[0]?.bbox?.minLon,
        maxLat: results[0]?.bbox?.maxLat,
        maxLon: results[0]?.bbox?.maxLon,
        countryName: results[0]?.country_name,
      };

      dispatch(setBbox(formatedResults));
      // dispatch(setSearch(formatedResults));
      // console.log(formatedResults, "bbox");
    } catch (err) {
      console.error(err, "bbox error");
    }
  }
)

// autocomplete specific country
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

// osrm
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

// graphHopper
export const handleDistanceForGH= createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const reqBody = {
        data: {
          start: {
            latitude: selectLocationFrom?.latitude,
            longitude: selectLocationFrom?.longitude
          },
          destination: {
            latitude: selectLocationTo?.latitude,
            longitude: selectLocationTo?.longitude
          }
        }
      };
      const res = await axios.post(
        `https://barikoi.xyz/v2/api/routing?key=bkoi_21ebd73425a38418c58e739f54b2ec5e43302bb67efe8c124d12bc8f1522f7fe&type=gh`,
        JSON.stringify(reqBody),
        {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }
      );
      // dispatch(setOsrmVanilla(res?.data));
      console.log(res);
    } catch (err: any) {
      console.error(err?.response?.data?.message);
      messageError(`${err?.response?.data?.message} - graphHopper`);
    }
  }
);

// valHalla
export const handleDistanceForValHalla = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const reqBody = {
        data: {
          start: {
            latitude: selectLocationFrom?.latitude,
            longitude: selectLocationFrom?.longitude
          },
          end: {
            latitude: selectLocationTo?.latitude,
            longitude: selectLocationTo?.longitude
          }
        }
      };
      const res = await axios.post(
        `https://barikoi.xyz/v2/api/routing?key=bkoi_21ebd73425a38418c58e739f54b2ec5e43302bb67efe8c124d12bc8f1522f7fe&type=vh`,
        JSON.stringify(reqBody),
        {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }
      );
      // dispatch(setOsrmVanilla(res?.data));
      console.log(res);
    } catch (err: any) {
      console.error(err?.response?.data?.message);
      messageError(`${err?.response?.data?.message} - valHalla`);
    }
  }
);

// Google
export const handleDistanceForGoogle = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo } = data;
    try {
      const reqBody = {
        origin: {
          location: {
            latLng: {
              latitude: selectLocationFrom.latitude,
              longitude: selectLocationFrom.longitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: selectLocationTo.latitude,
              longitude: selectLocationTo.longitude,
            },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        polylineEncoding: "ENCODED_POLYLINE",
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "en-US",
        units: "IMPERIAL",
      };

      // Create a Headers object
      const myHeaders = new Headers();
      myHeaders.append("X-Goog-Api-Key", "AIzaSyCIDXPl45TgEji0BSyJOrnFzBKxTxZIMCU");
      myHeaders.append(
        "X-Goog-FieldMask",
        "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
      );
      myHeaders.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)");
      myHeaders.append("Content-Type", "application/json");

      // Include the headers in the fetch request
      const response = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes?key=AIzaSyCIDXPl45TgEji0BSyJOrnFzBKxTxZIMCU`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(reqBody),
      });

      // Process the response
      const responseData = await response.json();
      if (responseData.routes && responseData.routes.length > 0) {
        const route = responseData.routes[0];
        const decodedPolyline = polyline.toGeoJSON(
          route.polyline.encodedPolyline
        );
        dispatch(setGoogleData({ ...route, decodedPolyline }));
        console.log({ ...route, decodedPolyline }, "decoded polyline");
      }
      return responseData;
    } catch (error) {
      console.error("Error fetching Google API:", error);
      throw error;
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
