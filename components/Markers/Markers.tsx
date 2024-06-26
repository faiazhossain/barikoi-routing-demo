//@ts-nocheck
import React from "react";
import { Marker } from "react-map-gl/maplibre";
import { useAppSelector } from "@/lib/hook";

const Markers = () => {
  const hoverLatLng: any = useAppSelector(
    (state) => state?.mainmap?.mouseEnteredMarker
  );
  const selectLocationFrom: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationFrom
  );
  console.log("🚀 ~ Markers ~ selectLocationFrom:", selectLocationFrom);
  const selectLocationTo: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationTo
  );

  return (
    <>
      {selectLocationFrom.longitude && (
        <Marker
          longitude={selectLocationFrom?.longitude}
          latitude={selectLocationFrom?.latitude}
          color="red"
        ></Marker>
      )}
      {selectLocationTo.longitude && (
        <Marker
          longitude={selectLocationTo?.longitude}
          latitude={selectLocationTo?.latitude}
          color="green"
        ></Marker>
      )}
      {hoverLatLng?.latitude && (
        <Marker
          longitude={hoverLatLng?.longitude}
          latitude={hoverLatLng?.latitude}
        ></Marker>
      )}
    </>
  );
};

export default Markers;
