"use client";
import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import RoutingAutocomplete from "../Autocomplete/RoutingAutocomplete";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  handleDistanceForGH,
  handleDistanceForGoogle,
  handleDistanceForOsrmKenya,
  handleDistanceForOsrmVanilla,
} from "@/lib/features/api/apiSlice";
import {
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

  const [routeType, setRouteType] = useState("");
  const [isDropdownEnabled, setIsDropdownEnabled] = useState(false);

  useEffect(() => {
    if (selectLocationFrom && selectLocationTo) {
      setIsDropdownEnabled(true);
    } else {
      setIsDropdownEnabled(false);
    }
    if (selectLocationFrom?.latitude && selectLocationTo?.latitude) {
      dispatch(
        handleDistanceForOsrmVanilla({
          selectLocationFrom,
          selectLocationTo,
        })
      )
      dispatch(
        handleDistanceForGH({
          selectLocationFrom,
          selectLocationTo,
        })
      )
      dispatch(
        handleDistanceForGoogle({
          selectLocationFrom,
          selectLocationTo,
        })
      )
    }
  }, [selectLocationFrom, selectLocationTo]);

  const handleCloseClick = () => {
    setRouting(false);
    dispatch(setSelectLocationFrom({}));
    dispatch(setSelectLocationTo({}));
    dispatch(setOsrmVanilla({}));
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
              // onChange={handleRouteTypeChange}
              disabled={!isDropdownEnabled}
            >
              <option value="">Select route</option>
              <option value="OSRM">OSRM</option>
              <option value="GraphHopper">GraphHopper</option>
              <option value="Valhalla">Valhalla</option>
            </select>
          </div>
        </nav>
      </aside>
    </div>
  );
}

export default StyledSlider;
