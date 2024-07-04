//@ts-nocheck
import React from "react";
import { Marker } from "react-map-gl/maplibre";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setAllRoutes, setSelectLocationFrom, setSelectLocationTo } from "@/lib/features/map/layerSlice";

const Markers = () => {
  const dispatch = useAppDispatch();
  const hoverLatLng: any = useAppSelector(
    (state) => state?.mainmap?.mouseEnteredMarker
  );
  const selectedMarker: any = useAppSelector(
    (state) => state?.mainmap?.selectedMarker
  )
  const selectLocationFrom: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationFrom
  );
  console.log("🚀 ~ Markers ~ selectLocationFrom:", selectLocationFrom);
  const selectLocationTo: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationTo
  );
 const handleDragEnd = (e, type) => {
  dispatch(setAllRoutes(null));
  if(type="from"){
    dispatch(setSelectLocationFrom({
      latitude: e?.lngLat?.lat,
      longitude: e?.lngLat?.lng,
      value: `${e?.lngLat?.lat},${e?.lngLat?.lng}`,
      name: `${e?.lngLat?.lat.toFixed(4)},${e?.lngLat?.lng.toFixed(4)}`,
      pointType: "From",
    }))
  } else{
    dispatch(setSelectLocationTo({
      latitude: e?.lngLat?.lat,
      longitude: e?.lngLat?.lng,
      value: `${e?.lngLat?.lat},${e?.lngLat?.lng}`,
      name: `${e?.lngLat?.lat.toFixed(4)},${e?.lngLat?.lng.toFixed(4)}`,
      pointType: "To",
    }))
  }
};
  return (
    <>
      {selectLocationFrom.longitude && (
        <Marker
          longitude={selectLocationFrom?.longitude}
          latitude={selectLocationFrom?.latitude}
          color="green"
          draggable={true}
          onDragEnd={(e) => {
            handleDragEnd(e, "from");
          }}
        ></Marker>
      )}
      {selectLocationTo.longitude && (
        <Marker
          longitude={selectLocationTo?.longitude}
          latitude={selectLocationTo?.latitude}
          color="red"
          draggable={true}
          onDragEnd={(e) => {
            handleDragEnd(e, "to");
          }}
        ></Marker>
      )}
      {hoverLatLng?.latitude && (
        <Marker
          longitude={hoverLatLng?.longitude}
          latitude={hoverLatLng?.latitude}
        ></Marker>
      )}
      {selectedMarker?.latitude && (
        <Marker
          longitude={selectedMarker?.longitude}
          latitude={selectedMarker?.latitude}
        ></Marker>
      )}
    </>
  );
};

export default Markers;
