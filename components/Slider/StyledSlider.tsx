"use client";
import React, { useState, useEffect } from "react";
import { ArrowUpDown, XCircle } from "lucide-react";
import RoutingAutocomplete from "../Autocomplete/RoutingAutocomplete";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  handleRoutes,
} from "@/lib/features/api/apiSlice";
import {
  setAllRoutes,
  setGoogleData,
  setOsrmVanilla,
  setSelectLocationFrom,
  setSelectLocationTo,
} from "@/lib/features/map/layerSlice";
import { setSelectedMarker } from "@/lib/features/map/mapSlice";
import { setRouteType } from "@/lib/features/map/leftPanelSlice";

function StyledSlider({ setRouting, bbox }: { setRouting: any; bbox: any }) {
  const dispatch = useAppDispatch();
  const allRoutes: any = useAppSelector(
    (state) => state?.layerSlice?.allRoutes ?? []
  )
  const selectLocationFrom: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationFrom
  );
  const selectLocationTo: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationTo
  );
  const routingApis = useAppSelector(
    (state) => state?.mainmap?.routingApis
  )
  const routeType = useAppSelector(
    (state) => state?.leftPanel?.routeType
  )
  // const [routeType, setRouteType] = useState("none");
  const [isDropdownEnabled, setIsDropdownEnabled] = useState(false);

  useEffect(() => {
    if (selectLocationFrom?.latitude && selectLocationTo?.latitude) {
      setIsDropdownEnabled(true);
    } else {
      setIsDropdownEnabled(false);
    }
    if (selectLocationFrom?.latitude && selectLocationTo?.latitude) {
      dispatch(handleRoutes({ selectLocationFrom, selectLocationTo, routingApis, routeType }));
    }else{
      dispatch(setAllRoutes(null));
    }
  }, [selectLocationFrom, selectLocationTo, routeType]);

  const handleRouteTypeChange = (e: any) => {
    dispatch(setAllRoutes(null));
    dispatch(setRouteType(e.target.value))
  };

  const handleCloseClick = () => {
    setRouting(false);
    dispatch(setSelectLocationFrom({}));
    dispatch(setSelectLocationTo({}));
    dispatch(setOsrmVanilla({}));
    dispatch(setGoogleData({}));
    dispatch(setAllRoutes(null));
    dispatch(setSelectedMarker({}));
    setIsDropdownEnabled(false);
    dispatch(setRouteType(null));
  };

  const swapValues = () => {
    dispatch(setAllRoutes(null));
    const tempLocation = selectLocationFrom;
    dispatch(setSelectLocationFrom(selectLocationTo));
    dispatch(setSelectLocationTo(tempLocation));
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/50">
      <aside
        className={`fixed rounded-r-sm inset-y-0 left-0 z-10 hidden flex-col border-r bg-white p-2 sm:flex transition-all duration-500 ease-in-out w-[350px]`}
      >
        <nav className="flex h-full w-full flex-col px-5">
          <div>
            <>
              <div className="flex w-full justify-end py-3">
                {" "}
                <span className="mx-auto my-auto text-xl h-8 ">
                  Routing
                </span>{" "}
                <XCircle
                  className="h-8 w-4 my-auto ml-14 text-red-500"
                  onClick={handleCloseClick}
                />{" "}
              </div>
              <hr />
            </>
          </div>

          <div>
      <div className="my-2">
        <label htmlFor="start" className="block text-sm font-medium text-gray-700">
          Start
        </label>
        <RoutingAutocomplete uniqueId={"start"} bbox={bbox}  />
      </div>
      {selectLocationFrom?.latitude && selectLocationTo?.latitude && <button
        type="button"
        className="flex rounded-full bg-white p-1 text-gray-400 hover:bg-gray-200 active:bg-gray-300 focus:outline-none mx-auto"
        onClick={swapValues}
      >
        <ArrowUpDown className="mx-auto h-4 w-4" />
      </button>}
      <div className="my-2">
        <label htmlFor="end" className="block text-sm font-medium text-gray-700">
          End
        </label>
        <RoutingAutocomplete uniqueId={"end"} bbox={bbox} />
      </div>
    </div>

          <div className="my-3">
            <label
              htmlFor="dropdown-example"
              className="block text-sm font-medium text-gray-700"
            >
              Select Route Type
            </label>
            <select
              id="dropdown-example"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={routeType}
              onChange={handleRouteTypeChange}
              disabled={!isDropdownEnabled}
            >
              <option value="none" disabled selected>Select Route</option>
              <option value="all">All</option>
              {routingApis.map((route: any) => (
                <option key={route?.id} value={route?.api_format}>
                  {route?.label}
                </option>
              ))}
            </select>
          </div>
        </nav>
        <div style={{ height: "470px", overflowY: "auto" }}>
          {allRoutes.map((route: any, index: any) => (
            <div key={index} style={{ position: "relative", marginBottom: "20px" }}>
              <div style={{ fontSize: "16px" }}>
                <b>{route.routeName} Route</b>
              </div>
              <div style={{ ...distanceTimeDivStyle }}>
                <div style={{ fontSize: "16px" }}>
                  <b>Distance:</b> {route.distance} km
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginTop: "5px",
                }}
              >
                <div style={{ fontSize: "16px" }}>
                  <b>Time:</b> {
                    (() => {
                      const durationInSeconds = typeof route.duration === 'number'
                        ? route.duration
                        : typeof route.duration === 'string'
                          ? parseInt(route.duration.replace('s', ''), 10)
                          : 0;
                      const hours = Math.floor(durationInSeconds / 3600);
                      const minutes = Math.floor((durationInSeconds % 3600) / 60);
                      let timeString = '';
                      if (hours > 0) timeString += `${hours} hr `;
                      if (minutes > 0 || hours === 0) timeString += `${minutes} min`;
                      return timeString;
                    })()
                  }
                </div>
              </div>
              <div
                style={{
                  padding: "10px",
                  top: "0",
                  right: "0",
                  position: "absolute",
                  background: `rgb(${route.lineColor})`,
                }}
              >
                Route Color
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default StyledSlider;

// jsx styles
const iconStyleFromTo = {
  fontSize: "18px",
  color: "#32a66b",
};
const iconStyleFromToTest = {
  fontSize: "18px",
  color: "#492E87",
};
const distanceTimeDivStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};