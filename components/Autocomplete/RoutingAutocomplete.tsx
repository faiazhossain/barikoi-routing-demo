import { handleSearchPlacesSelectedCountry } from "@/lib/features/api/apiSlice";
import {
  setAllRoutes,
  setSelectLocationFrom,
  setSelectLocationTo,
} from "@/lib/features/map/layerSlice";
import { setRouteType, setSelectAutocompleteData } from "@/lib/features/map/leftPanelSlice";
import { setPreviouslySelectedValue, setSelectedMarker } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
// import { FaDirections } from "react-icons/fa";
// import { set } from "lodash";
function RoutingAutocomplete({ uniqueId, bbox }: { uniqueId: any; bbox: any }) {
  const dispatch = useAppDispatch();
  const selectLocationFrom: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationFrom
  )
  const selectLocationTo: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationTo
  )
  type Item = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    properties: object;
  };
  const previouslySelectedValue: any = useAppSelector(
    (state) => state?.mainmap?.previouslySelectedValue
  );
  const handleOnSearch = (string: string, results: Item[]) => {
    if (string !== previouslySelectedValue) {
      dispatch(
        handleSearchPlacesSelectedCountry({
          value: string,
          minLon: bbox.minLon,
          minLat: bbox.minLat,
          maxLon: bbox.maxLon,
          maxLat: bbox.maxLat,
        })
      );
      dispatch(setPreviouslySelectedValue(string));
      dispatch(setSelectAutocompleteData({}));
    }
  };

  const handleOnHover = (result: Item) => {
    // console.log(result);
  };
  const searchData: any = useAppSelector((state) => state?.mainmap?.search);
  const handleOnSelect = (item: Item) => {
    dispatch(setAllRoutes(null));
    dispatch(setRouteType(null));
    // console.log(item, "uniqueId itemmmmm");
    const lat = item.lat;
    const lng = item.lng;
    const data = { lat, lng };
    const dataFromGeoCode = {
      latitude: data?.lat,
      longitude: data?.lng,
      value: `${data?.lat},${data?.lng}`,
      name: item?.name,
    };
    uniqueId === "start" &&
      dispatch(
        setSelectLocationFrom({ ...dataFromGeoCode, pointType: "From" })
      );
    uniqueId === "end" &&
      dispatch(setSelectLocationTo({ ...dataFromGeoCode, pointType: "To" }));
  };

  const handleOnFocus = () => {
    // console.log("Focused");
  };
  const handleOnclear = () => {
    dispatch(setSelectAutocompleteData({}));
    dispatch(setAllRoutes(null));
    dispatch(setRouteType(null));
    uniqueId === "start" && dispatch(setSelectLocationFrom({}));
    uniqueId === "end" && dispatch(setSelectLocationTo({}));
  };

  const formatResult = (item: Item) => {
    return (
      <>
        <span style={{ textAlign: "left" }}>{item.name}</span>
      </>
    );
  };
  const items = searchData?.map((option: any) => ({
    id: option.key,
    name: option.value,
    lat: option.latitude,
    lng: option.longitude,
    properties: option.properties,
  }));

  return (
    <div>
      <div
        className={`mt-2 ml-2 autocomplete-wrapper-${uniqueId}`}
        style={{ width: 280 }}
      >
        <ReactSearchAutocomplete
          items={items}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          autoFocus
          onClear={handleOnclear}
          inputDebounce={250}
          showNoResults={false}
          formatResult={formatResult}
          placeholder="Search for a place"
          className={uniqueId === "start" ? "z-20" : "z-10"}
          inputSearchString={uniqueId === "start" ? selectLocationFrom?.latitude?selectLocationFrom?.name:'' : selectLocationTo?.latitude? selectLocationTo?.name:''}
        />
      </div>
    </div>
  );
}

export default RoutingAutocomplete;
