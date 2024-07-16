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
import RightClickPopup from "../common/popup/RightClickPopup";


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
  const [showPopupRightClick, setShowPopupRightClick] = React.useState(false);
  const [rightClickLatLng, setRightClickLatLng] = React.useState({});
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
        { padding: { top: 40, right: 40, bottom: 40, left: 380 }, duration: 1000 }
      );
    }
  }, [selectLocationFrom, selectLocationTo]);

  // show popup on right click
  const handleRightClick = (e) => {
    setShowPopupRightClick(true);
    // dispatch(setLngLatFromRightClick(e?.lngLat));
    setRightClickLatLng(e?.lngLat);

  };
  // fly to selected marker
  useEffect(() => {
    if (selectedMarker?.latitude && selectedMarker?.longitude) {
      // console.log(selectedMarker, "selectedMarkerssssssssssss");
      mapRef.current?.flyTo({ center: [selectedMarker.longitude, selectedMarker.latitude], zoom: 11, speed: 0.8, curve: 1, essential: true });
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
        latitude: bbox?.maxLat ?? 26.145652,
        longitude: bbox?.maxLon ?? 88.183961,
        zoom: 5,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="https://tiles.barikoimaps.dev/styles/barkoi_green/style.json"
      onContextMenu={handleRightClick}
    >
      {routingPage ? (
        <StyledSlider bbox={bbox} setRouting={setRoutingPage} />
      ) : (
        <Autocomplete bbox={bbox} setRouting={setRoutingPage} />
      )}
      <FitToCountry />
      <Markers />
      {leftPanelData?.id && <LocationDetails location={leftPanelData} />}
      {/* map layers  */}
      <RouteLayer />

      {/* popup on right click */}
      <RightClickPopup 
      showPopup={showPopupRightClick} 
      rightClickLatLng={rightClickLatLng}
      onClose={() => setShowPopupRightClick(false)}
      setRouting={setRoutingPage}
      />
    </Map>
  );
};

export default MainMap;
