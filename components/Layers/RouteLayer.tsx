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
  const osrmVanilla = useAppSelector(
    (state) => state?.layerSlice?.osrmVanilla ?? null
  );
  const osrmKenya = useAppSelector(
    (state) => state?.layerSlice?.osrmKenya ?? null
  );

  const OsrmVanilla =
    osrmVanilla?.routes?.length > 0 ? osrmVanilla?.routes[0]?.geometry : null;
  
  const googleData = useAppSelector(
    (state) => state?.layerSlice?.googleData ?? null
  );

  const geoJsonDataGoogle = googleData?.decodedPolyline
    ? googleData?.decodedPolyline
    : null;

  console.log("🚀 ~ RouteLayer ~ OsrmVanilla:", OsrmVanilla);
  console.log("🚀 ~ RouteLayer ~ geoJsonDataGoogle:", geoJsonDataGoogle);
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
    lineWidthScale: 20 + index * 10, // Example of dynamic scaling
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
