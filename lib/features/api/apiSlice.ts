import axios from "axios";

import { createAsyncThunk } from "@reduxjs/toolkit";
// import { message } from "antd";
import { API } from "@/app.config";
import { setBbox, setRoutingApis, setSearch } from "../map/mapSlice";
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

      // Add another API call here
      const routingUrl = `${API.ROUTING_API}`;
      const routingRes = await axios.get(routingUrl);
      dispatch(setRoutingApis(routingRes?.data?.items));
      console.log(routingRes?.data?.items, "Another API data");

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

// osrm, graphHopper, valHalla
export const handleRoutes = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo, routingApis, routeType } = data;
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

    
    // Call the APIs
    for (const routingApi of routingApis) {
      if (routingApi.api_name === "osrm" && (routeType === "" || routeType === "osrm")) {
        const apiUrl = routingApi.api_url
        .replace('${selectLocationFrom?.longitude}', selectLocationFrom?.longitude)
        .replace('${selectLocationFrom?.latitude}', selectLocationFrom?.latitude)
        .replace('${selectLocationTo?.longitude}', selectLocationTo?.longitude)
        .replace('${selectLocationTo?.latitude}', selectLocationTo?.latitude);
        try {
          const osrmRes = await axios.get(apiUrl);
          dispatch(setOsrmVanilla(osrmRes?.data));
        } catch (err: any) {
          console.error(`OSRM API Error: ${err?.response?.data?.message}`);
          messageError(`OSRM API Error: ${err?.response?.data?.message}`);
          // Handle OSRM API error appropriately
        }
      } else if (routingApi.api_name === "gh" && (routeType === "" || routeType === "gh")) {
        try {
          const graphHopperRes = await axios.post(routingApi.api_url, {
            reqBody
          }, {
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          });
          // dispatch(setGraphHopper(graphHopperRes?.data));
          console.log(graphHopperRes?.data, "graphHopperRes");
        } catch (err: any) {
          console.error(`GraphHopper API Error: ${err?.response?.data?.message}`);
          messageError(`GraphHopper API Error: ${err?.response?.data?.message}`); 
          // Handle GraphHopper API error appropriately
        }
      } else if (routingApi.api_name === "vh" && (routeType === "" || routeType === "vh")) {
        try {
          const valHallaRes = await axios.post(routingApi.api_url, {
            reqBody
          }, {
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          });
          // dispatch(setValhalla(valHallaRes?.data));
          console.log(valHallaRes?.data, "valHallaRes");
        } catch (err: any) {
          console.error(`Valhalla API Error: ${err?.response?.data?.message}`);
          messageError(`Valhalla API Error: ${err?.response?.data?.message}`);
          // Handle Valhalla API error appropriately
        }
      } else if (routingApi.api_name === "google" && (routeType === "" || routeType === "google")) {
        // Google Maps API call
        const apiUrl = routingApi.api_url
        dispatch(handleDistanceForGoogle({ selectLocationFrom, selectLocationTo , apiUrl}));
    }
    }
  }
);

// Google
export const handleDistanceForGoogle = createAsyncThunk(
  "search/searchPlaces",
  async (data: any, { dispatch }) => {
    const { selectLocationFrom, selectLocationTo , apiUrl} = data;
    try {
      const reqBodyGoogle = {
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
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(reqBodyGoogle),
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
