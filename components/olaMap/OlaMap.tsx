"use client"
//@ts-nocheck
import * as React from 'react';
import Map from 'react-map-gl/maplibre';
import "maplibre-gl/dist/maplibre-gl.css";

export function OlaMap() {
    const transformReq=(url:any, resourceType:any) => {
        url = url + "?api_key=3ad32kxsfhckWEUztK6OpYFuN6sgAVkIe2yExXVU";
        return { url, resourceType };
      }
  return (
    <Map
      initialViewState={{
        longitude: 88.3639,
        latitude: 22.5726,
        zoom: 7
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json"
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1229590010.
      transformRequest={ transformReq }
    />
  );
}