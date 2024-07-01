//@ts-nocheck
"use client";
import React, { useRef, useEffect, use } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import Map, { Marker } from "react-map-gl/maplibre";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import LocationDetails from "../LeftPanelData/locationDetails";
import StyledSlider from "../Slider/StyledSlider";
import RouteLayer from "../Layers/RouteLayer";
import Markers from "../Markers/Markers";
import { handleBbox } from "@/lib/features/api/apiSlice";


const MainMap = () => {
  const mapRef = useRef<MapRef>(null);
  const dispatch = useAppDispatch();
  const bbox: any = useAppSelector((state) => state?.mainmap?.bbox);
  const hoverLatLng: any = useAppSelector(
    (state) => state?.mainmap?.mouseEnteredMarker
  );
  const selectedMarker: any = useAppSelector(
    (state) => state?.mainmap?.selectedMarker
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

  // get bbox for selected country
  useEffect(() => {
    dispatch(handleBbox({}));
    // console.log('from useEffect', bbox);
  }, []);
  // fit bounds to selected locations
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

  // fly to selected marker
  useEffect(() => {
    if (selectedMarker?.latitude && selectedMarker?.longitude) {
      console.log(selectedMarker);
      mapRef.current?.flyTo({ center: [selectedMarker.longitude, selectedMarker.latitude], zoom: 15 });
    }
  }, [selectedMarker]);

  // fit bounds to selected country
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
