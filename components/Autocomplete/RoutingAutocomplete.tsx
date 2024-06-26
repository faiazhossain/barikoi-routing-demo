import { handleSearchPlacesSelectedCountry } from "@/lib/features/api/apiSlice";
import { setSelectAutocompleteData } from "@/lib/features/map/leftPanelSlice";
import { setMouseEnteredMarker, setPreviouslySelectedValue } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import React, { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
// import { FaDirections } from "react-icons/fa";
// import { set } from "lodash";
function RoutingAutocomplete({bbox, uniqueId}: any) {
  console.log(bbox);
  type Item = {
    id: number;
    name: string;
    lat: number;
    lng: number;
  };
  const dispatch = useAppDispatch();
  const previouslySelectedValue: any = useAppSelector(
    (state) => state?.mainmap?.previouslySelectedValue
  );
  const searchData: any = useAppSelector((state) => state?.mainmap?.search);
  const [items, setItems] = useState<Item[]>([]);
  const handleOnSearch = (string: string) => {
    console.log(string);
    if (string !== previouslySelectedValue) {
      dispatch(
        handleSearchPlacesSelectedCountry({
          value: string,
          minLon: bbox?.minLon,
          minLat: bbox?.minLat,
          maxLon: bbox?.maxLon,
          maxLat: bbox?.maxLat,
        })
      );
      dispatch(setPreviouslySelectedValue(string));
      dispatch(setSelectAutocompleteData({}));
    }
  };

  const handleOnClear = () => {
    dispatch(setPreviouslySelectedValue(""));
    dispatch(setSelectAutocompleteData({}));
  };
  const handleOnHover = (result: Item) => {
    dispatch(
      setMouseEnteredMarker({
        latitude: result.lat,
        longitude: result.lng,
      })
    );
  };

  const handleOnSelect = (item: Item) => {
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item: Item) => {
    return (
      <>
        <span style={{ textAlign: "left", }}>
          {item.name}
        </span>
      </>
    );
  };
  useEffect(() => {
    if (searchData) {
      const updatedItems = searchData.map((option: any) => ({
        id: option.key,
        name: option.value,
        lat: option.latitude,
        lng: option.longitude,
        properties: option.properties,
      }));
      setItems(updatedItems);
    }
  }, [searchData]);

  return (
    <div >
        <div className={`mt-2 ml-2 autocomplete-wrapper-${uniqueId}`} style={{ width: 280 }}>
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            inputDebounce={300}
            showNoResults={false}
            onClear={handleOnClear}
            formatResult={formatResult}
            placeholder="Search for a place"
            
          />
        </div>
    </div>
  );
}

export default RoutingAutocomplete;
