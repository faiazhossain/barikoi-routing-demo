"use client";
import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import RoutingAutocomplete from "../Autocomplete/RoutingAutocomplete";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  handleRoutes,
} from "@/lib/features/api/apiSlice";
import {
  setGoogleData,
  setOsrmVanilla,
  setSelectLocationFrom,
  setSelectLocationTo,
} from "@/lib/features/map/layerSlice";

function StyledSlider({ setRouting, bbox }: { setRouting: any; bbox: any }) {
  const dispatch = useAppDispatch();
  const selectLocationFrom: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationFrom
  );
  const selectLocationTo: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationTo
  );
  const osrmVanilla = useAppSelector(
    (state) => state?.layerSlice?.osrmVanilla ?? null
  ) as { routes: any[] };
  const googleData = useAppSelector(
    (state) => state?.layerSlice?.googleData ?? null 
  ) as { duration: any, distanceMeters: number };
  const routingApis = useAppSelector(
    (state) => state?.mainmap?.routingApis
  )
  const [routeType, setRouteType] = useState("");
  const [isDropdownEnabled, setIsDropdownEnabled] = useState(false);

  useEffect(() => {
    if (selectLocationFrom && selectLocationTo) {
      setIsDropdownEnabled(true);
    } else {
      setIsDropdownEnabled(false);
    }
    if (selectLocationFrom?.latitude && selectLocationTo?.latitude) {
      dispatch(handleRoutes({ selectLocationFrom, selectLocationTo, routingApis, routeType }));
    }
  }, [selectLocationFrom, selectLocationTo, routeType]);

  const handleRouteTypeChange = (e: any) => {
    setRouteType(e.target.value);
    if (e.target.value === "gh") {
      // dispatch(handleDistanceForGH({ selectLocationFrom, selectLocationTo }));
      dispatch(setGoogleData({}));
      dispatch(setOsrmVanilla({}));
    } else if (e.target.value === "vh") {
      // dispatch(
      //   handleDistanceForValHalla({ selectLocationFrom, selectLocationTo })
      // );
      dispatch(setGoogleData({}));
      dispatch(setOsrmVanilla({}));
    // } else if (e.target.value === "google") {
    //   dispatch(
    //     handleDistanceForGoogle({ selectLocationFrom, selectLocationTo })
    //   );
      // dispatch(setGoogleData({}));
      dispatch(setOsrmVanilla({}));
    }else if (e.target.value === "osrm") {
      // dispatch(
      //   handleDistanceForOsrmVanilla({ selectLocationFrom, selectLocationTo })
      // );
      dispatch(setGoogleData({}));
      // dispatch(setOsrmVanilla({}));
    }else if (e.target.value === "google") {
      dispatch(setOsrmVanilla({}));
      // dispatch(setGoogleData({}));
    }
  };

  const handleCloseClick = () => {
    setRouting(false);
    dispatch(setSelectLocationFrom({}));
    dispatch(setSelectLocationTo({}));
    dispatch(setOsrmVanilla({}));
    dispatch(setGoogleData({}));
    setIsDropdownEnabled(false);
  };
 
  const routes = [
    { value: "osrm", label: "OSRM" },
    { value: "gh", label: "GraphHopper" },
    { value: "vh", label: "Valhalla" },
    { value: "google", label: "Google" },
  ];
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

          <div className="my-3">
            <label
              htmlFor="dropdown-example"
              className="block text-sm font-medium text-gray-700"
            >
              Start
            </label>
            <RoutingAutocomplete uniqueId={"start"} bbox={bbox} />
          </div>
          <div className="my-3">
            <label
              htmlFor="dropdown-example"
              className="block text-sm font-medium text-gray-700"
            >
              End
            </label>
            <RoutingAutocomplete uniqueId={"end"} bbox={bbox} />
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
              <option value="">All</option>
              {routingApis.map((route: any) => (
                <option key={route?.id} value={route?.api_name}>
                  {route?.label}
                </option>
              ))}
            </select>
          </div>
        </nav>
        {osrmVanilla?.routes && (
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: "16px" }}>
                <b>OSRM - Vanilla</b>
              </div>
              <div style={{ ...distanceTimeDivStyle }}>
                {/* <GiPathDistance style={{ ...iconStyleFromTo }} /> */}
                <div style={{ fontSize: "16px" }}>
                  <b>Distance:</b> {osrmVanilla?.routes[0]?.distance ? (osrmVanilla.routes[0].distance / 1000).toFixed(2) : null} km{" "}
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
                {/* <BiTime style={{ ...iconStyleFromTo }} /> */}
                <div style={{ fontSize: "16px" }}>
                  {/* Convert to hours and minutes */}
                  {osrmVanilla?.routes[0]?.duration ? (
                    <div>
                      <b>Time:</b>{" "}
                      {Math.floor(osrmVanilla.routes[0].duration / 3600) +
                        " hr " +
                        Math.floor(
                          (osrmVanilla.routes[0].duration % 3600) / 60
                        ) +
                        " min"}
                    </div>
                  ) : null}
                  {/* <b>{hours} hour{hours !== 1 ? 's' : ''} {minutes} minute {minutes !== 1 ? 's' : ''}</b> */}
                </div>
              </div>
              <div
                style={{
                  padding: "10px",
                  top: "0",
                  right: "0",
                  position: "absolute",
                  background: "rgba(55, 103, 210,.8)",
                }}
              >
                Route Color
              </div>
            </div>
          )}
          {/* For google */}
          {/* {distance && <Divider></Divider>} */}
          <br/> 
          {googleData?.duration && (
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: "16px" }}>
                <b>Google Route</b>
              </div>
              <div style={{ ...distanceTimeDivStyle }}>
                {/* <GiPathDistance style={{ ...iconStyleFromTo }} /> */}
                <div style={{ fontSize: "16px" }}>
                  <b>Distance:</b> {(googleData?.distanceMeters ?? 0) / 1000} km{" "}
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
                {/* <BiTime style={{ ...iconStyleFromTo }} /> */}
                <div style={{ fontSize: "16px" }}>
  <b>Time:</b> {
    (() => {
      // Check if duration is a number (in seconds) or a string like "63s"
      const durationInSeconds = typeof googleData?.duration === 'number' 
        ? googleData.duration 
        : typeof googleData?.duration === 'string' 
          ? parseInt(googleData.duration.replace('s', ''), 10) 
          : 0;

      // Calculate hours and minutes
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);

      // Format the string to display
      let timeString = '';
      if (hours > 0) timeString += `${hours} hour${hours !== 1 ? 's' : ''} `;
      if (minutes > 0 || hours === 0) timeString += `${minutes} minute${minutes !== 1 ? 's' : ''}`;

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
                  background: "rgba(255, 0, 0, 0.8)",
                }}
              >
                Route Color
              </div>
            </div>
          )}
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