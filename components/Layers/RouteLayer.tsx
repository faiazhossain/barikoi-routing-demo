//@ts-nocheck
import React from "react";
import { useControl, useMap } from "react-map-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { useAppSelector } from "@/lib/hook";
const DeckGLOverlay = (props: any) => {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

const RouteLayer = () => {
  const allRoutes = useAppSelector((state) => state?.layerSlice?.allRoutes ?? []);

  
 

  // console.log("🚀 ~ RouteLayer ~ OsrmVanilla:", OsrmVanilla);
  // console.log("🚀 ~ RouteLayer ~ geoJsonDataGoogle:", geoJsonDataGoogle);
  console.log(allRoutes);
  // const geoJsonDataGoogle = googleData?.decodedPolyline
  //   ? googleData?.decodedPolyline
  //   : null;

  const layers = allRoutes.map((route, index) => new GeoJsonLayer({
    id: `geojson-layer${index}`,
    data: route,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: true,
    pointType: "circle",
    lineWidthScale: 50 - index * 8,
    lineWidthMaxPixels: 5,
    lineWidthMinPixels: 3,
    getLineColor: route.lineColor || [0, 255, 0], // Fallback to a default color if lineColor is not defined
    getPointRadius: 100,
    getLineWidth: 4,
    getElevation: 30,
    wireframe: true,
    opacity: 0.6,
  }));

  return (
    <div>
      <DeckGLOverlay layers={[...layers]} />
    </div>
  );
};

export default RouteLayer;
