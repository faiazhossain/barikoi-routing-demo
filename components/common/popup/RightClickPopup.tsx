//@ts-nocheck
// RightClickPopup.js
import { setAllRoutes, setSelectLocationFrom, setSelectLocationTo } from "@/lib/features/map/layerSlice";
import { useAppDispatch } from "@/lib/hook";
import React from "react";
import { Popup } from "react-map-gl";

const RightClickPopup = ({
  showPopup,
  rightClickLatLng,
  onClose,
  setRouting,
//   onClickCopy,
}) => {
const dispatch = useAppDispatch();
  const handleStart = () => {
    dispatch(setAllRoutes(null));
    dispatch(setSelectLocationFrom({ 
      latitude: rightClickLatLng?.lat, 
      longitude: rightClickLatLng?.lng,
      value: `${rightClickLatLng?.lat},${rightClickLatLng?.lng}`,
      name: `${rightClickLatLng?.lat.toFixed(4)},${rightClickLatLng?.lng.toFixed(4)}`,
      pointType: "From", 
    }));
    setRouting(true);
    onClose();
  };
  const handleEnd = () => {
    dispatch(setAllRoutes(null));
    dispatch(setSelectLocationTo({ 
      latitude: rightClickLatLng?.lat, 
      longitude: rightClickLatLng?.lng,
      value: `${rightClickLatLng?.lat},${rightClickLatLng?.lng}`,
      name: `${rightClickLatLng?.lat.toFixed(4)},${rightClickLatLng?.lng.toFixed(4)}`,
      pointType: "To", 
    }));
    setRouting(true);
    onClose();
  };
  return (
    showPopup &&
    rightClickLatLng && (
      <Popup
        longitude={rightClickLatLng?.lng}
        latitude={rightClickLatLng?.lat}
        anchor="bottom"
        onClose={onClose}
      >
        <div
        >
          {rightClickLatLng?.lat?.toFixed(6)},
          {rightClickLatLng?.lng?.toFixed(6)}
          <br />
          <div >
            <button onClick={handleStart} className="text-xs text-blue-500">Set as Start</button>
          </div>
          <div className="mt-1">
            <button onClick={handleEnd} className="text-xs text-blue-500">Set as End</button>
          </div>
        </div>
      </Popup>
    )
  );
};

export default RightClickPopup;
