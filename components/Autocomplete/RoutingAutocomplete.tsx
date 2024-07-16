import { handleSearchPlacesSelectedCountry } from "@/lib/features/api/apiSlice";
import {
  setAllRoutes,
  setSelectLocationFrom,
  setSelectLocationTo,
} from "@/lib/features/map/layerSlice";
import { setRouteType, setSelectAutocompleteData } from "@/lib/features/map/leftPanelSlice";
import { setPreviouslySelectedValue, setSelectedMarker } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import React, { useState } from "react";
import { AutoComplete } from 'antd';

function RoutingAutocomplete({ uniqueId, bbox }: { uniqueId: any; bbox: any }) {
  type Item = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    properties: object;
  };
  const dispatch = useAppDispatch();
  const selectLocationFrom: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationFrom
  );
  const selectLocationTo: any = useAppSelector(
    (state: any) => state?.layerSlice?.selectLocationTo
  );
  const previouslySelectedValue: any = useAppSelector(
    (state) => state?.mainmap?.previouslySelectedValue
  );
  const searchData: any = useAppSelector((state) => state?.mainmap?.search);
  const [options, setOptions] = useState<Item[]>([]);
  const [value, setValue] = useState("")

  const handleOnSearch = (value: string) => {
    if (value !== previouslySelectedValue) {
      dispatch(
        handleSearchPlacesSelectedCountry({
          value: value,
          minLon: bbox.minLon,
          minLat: bbox.minLat,
          maxLon: bbox.maxLon,
          maxLat: bbox.maxLat,
        })
      );
      dispatch(setPreviouslySelectedValue(value));
      dispatch(setSelectAutocompleteData({}));
    }
  };

  const handleOnSelect = (value: string, option: any) => {
    dispatch(setAllRoutes(null));
    dispatch(setRouteType(null));
    const item = option.item as Item;
    const dataFromGeoCode = {
      latitude: item.lat,
      longitude: item.lng,
      value: `${item.lat},${item.lng}`,
      name: item.name,
    };
    if (uniqueId === "start") {
      dispatch(setSelectLocationFrom({ ...dataFromGeoCode, pointType: "From" }));
    } else if (uniqueId === "end") {
      dispatch(setSelectLocationTo({ ...dataFromGeoCode, pointType: "To" }));
    }
    setValue(value);
  };

  const handleOnClear = () => {
    dispatch(setSelectAutocompleteData({}));
    dispatch(setAllRoutes(null));
    dispatch(setRouteType(null));
    setValue('')
    if (uniqueId === "start") {
      dispatch(setSelectLocationFrom({}));
    } else if (uniqueId === "end") {
      dispatch(setSelectLocationTo({}));
    }
  };

  const formatResult = (item: Item) => {
    return (
      <>
        <span style={{ textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  const optionsData = searchData?.map((option: any) => ({
    value: option.value,
    label: <span>{option.value}</span>,
    item: {
      id: option.key,
      name: option.value,
      lat: option.latitude,
      lng: option.longitude,
      properties: option.properties,
    },
  }));

  return (
    <div>
      <div className={`mt-2 ml-2 autocomplete-wrapper-${uniqueId}`} style={{ width: 280 }}>
        <AutoComplete
          options={optionsData}
          onSearch={handleOnSearch}
          onSelect={handleOnSelect}
          value={uniqueId === "start"? selectLocationFrom?.name ?? value : selectLocationTo?.name ?? value }
          allowClear
          onClear={handleOnClear}
          placeholder="Search for a place"
          className={uniqueId === "start" ? "z-20" : "z-10"}
          style={{
            width: "100%",
            position: "relative"
          }}
        >
        </AutoComplete>
      </div>
    </div>
  );
}

export default RoutingAutocomplete;
