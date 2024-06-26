//@ts-nocheck
"use client";
import React, { useRef, useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import Map, { Marker } from "react-map-gl/maplibre";
import { useAppSelector } from "@/lib/hook";
import LocationDetails from "../LeftPanelData/locationDetails";
import StyledSlider from "../Slider/StyledSlider";
import RouteLayer from "../Layers/RouteLayer";
import Markers from "../Markers/Markers";
import {
  setSelectLocationFrom,
  setSelectLocationTo,
} from "@/lib/features/map/layerSlice";

const MainMap = ({ bbox }) => {
  const mapRef = useRef<MapRef>(null);
  const hoverLatLng: any = useAppSelector(
    (state) => state?.mainmap?.mouseEnteredMarker
  );
  const leftPanelData: any = useAppSelector(
    (state) => state?.leftPanel?.selectAutocompleteData
  );
  const selectLocationFrom: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationFrom
  );
  const selectLocationTo: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationTo
  );
  const [routingPage, setRoutingPage] = React.useState(false);

  useEffect(() => {
    if (selectLocationFrom.latitude && selectLocationTo.latitude) {
      mapRef.current.fitBounds(
        [
          [selectLocationFrom.longitude, selectLocationFrom.latitude],
          [selectLocationTo.longitude, selectLocationTo.latitude],
        ],
        { padding: 40, duration: 1000 }
      );
    }
  }, [selectLocationFrom, selectLocationTo]);

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
        Fit To {bbox.countryName}
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
      {routingPage ? (
        <StyledSlider bbox={bbox} setRouting={setRoutingPage} />
      ) : (
        <Autocomplete bbox={bbox} setRouting={setRoutingPage} />
      )}
      <FitToCountry />
      <Markers />
      {leftPanelData?.id && <LocationDetails location={leftPanelData} />}
      <RouteLayer />
    </Map>
  );
};

export default MainMap;
