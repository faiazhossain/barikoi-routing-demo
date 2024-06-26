import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { FaDirections } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  setMouseEnteredMarker,
  setPreviouslySelectedValue,
} from "@/lib/features/map/mapSlice";
import { handleSearchPlacesSelectedCountry } from "@/lib/features/api/apiSlice";

function Autocomplete({ bbox ,setRouting}: any) {
  type Item = {
    id: number;
    name: string;
  };
  const dispatch = useAppDispatch();
  const previouslySelectedValue: any = useAppSelector(
    (state) => state?.mainmap?.previouslySelectedValue
  );
  // const items: Item[] = [

  const handleOnSearch = (string: string) => {
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
    }
  };
  const searchData: any = useAppSelector((state) => state?.mainmap?.search);

  const handleOnHover = (result: Item) => {
    console.log(result);
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
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  const items = searchData?.map((option: any) => ({
    name: option.value,
  }));

  const mouseEntered = (lat: any, lng: any) => {
    dispatch(setMouseEnteredMarker({ latitude: lat, longitude: lng }));
  };

  return (
    <div className="App z-10">
      <header className="App-header">
        <div className="mt-2 ml-2 relative" style={{ width: 400 }}>
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
            styling={{
              height: "44px",
              border: "1px solid #dfe1e5",
              borderRadius: "24px",
              backgroundColor: "white",
              boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
              hoverBackgroundColor: "#eee",
              color: "#212121",
              fontSize: "16px",
              fontFamily: "Arial",
              iconColor: "grey",
              lineColor: "rgb(232, 234, 237)",
              placeholderColor: "grey",
              clearIconMargin: "3px 44px 0 0",
              searchIconMargin: "0 0 0 16px",
            }}
          />
          <div className="absolute top-3 right-3 text-xl text-green-600 cursor-pointer" onClick={() => setRouting(true)}>
            <FaDirections />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Autocomplete;
