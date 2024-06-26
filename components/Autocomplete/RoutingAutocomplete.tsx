import { handleSearchPlacesSelectedCountry } from "@/lib/features/api/apiSlice";
import {
  setSelectLocationFrom,
  setSelectLocationTo,
} from "@/lib/features/map/layerSlice";
import { setSelectAutocompleteData } from "@/lib/features/map/leftPanelSlice";
import { setPreviouslySelectedValue } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
// import { FaDirections } from "react-icons/fa";
// import { set } from "lodash";
function RoutingAutocomplete({ uniqueId, bbox }: { uniqueId: any; bbox: any }) {
  const dispatch = useAppDispatch();
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
    // console.log(item, uniqueId);
    const lat = item.lat;
    const lng = item.lng;
    const data = { lat, lng };
    const dataFromGeoCode = {
      latitude: data?.lat,
      longitude: data?.lng,
      value: `${data?.lat},${data?.lng}`,
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
          formatResult={formatResult}
          placeholder="Search for a place"
          className={uniqueId === "start" ? "z-20" : "z-0"}
        />
      </div>
    </div>
  );
}

export default RoutingAutocomplete;
