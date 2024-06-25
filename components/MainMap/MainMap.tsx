//@ts-nocheck
"use client";
import React, { useRef, useEffect } from "react";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import type { MapRef } from "react-map-gl";

const MainMap = ({ bbox }) => {
  const mapRef = useRef<MapRef>(null);

  const FitToCountry = () => {
    const onclick = () => {
      mapRef.current.fitBounds(
        [
          [bbox.minLon, bbox.minLat],
          [bbox.maxLon, bbox.maxLat],
        ],
        { padding: 40, duration: 1000 }
      );
    };
    return (
      <button
        className="absolute top-2 right-2 bg-white hover:bg-purple-100 p-2 rounded-lg text-black"
        onClick={onclick}
      >
        Fit To Country
      </button>
    );
  };
  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: 23.76663,
        longitude: 90.37839,
        zoom: 11,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="https://tiles.barikoimaps.dev/styles/barkoi_green/style.json"
    >
      <Autocomplete bbox={bbox} />
      <FitToCountry />
    </Map>
  );
};

export default MainMap;
