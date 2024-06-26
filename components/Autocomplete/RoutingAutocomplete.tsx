import { useAppSelector } from "@/lib/hook";
import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
// import { FaDirections } from "react-icons/fa";
// import { set } from "lodash";
function RoutingAutocomplete({uniqueId}: {uniqueId: any}) {
  type Item = {
    id: number;
    name: string;
    lat: number;
    lng: number;
  };

  const handleOnSearch = (string: string, results: Item[]) => {
    console.log(string, results);
  };

  const handleOnHover = (result: Item) => {
    console.log(result);
  };
  const searchData: any = useAppSelector((state) => state?.mainmap?.search);
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
  const items = searchData?.map((option: any) => ({
    name: option.value,
  }));

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
            formatResult={formatResult}
            placeholder="Search for a place"
            
          />
        </div>
    </div>
  );
}

export default RoutingAutocomplete;
