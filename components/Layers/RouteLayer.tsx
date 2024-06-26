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
  const osrmVanilla = useAppSelector(
    (state) => state?.layerSlice?.osrmVanilla ?? null
  );
  const osrmKenya = useAppSelector(
    (state) => state?.layerSlice?.osrmKenya ?? null
  );

  const OsrmVanilla =
    osrmVanilla?.routes?.length > 0 ? osrmVanilla?.routes[0]?.geometry : null;

  const OsrmKenya =
    osrmKenya?.routes?.length > 0 ? osrmKenya?.routes[0]?.geometry : null;

  console.log("🚀 ~ RouteLayer ~ OsrmVanilla:", OsrmVanilla);
  // const geoJsonDataGoogle = googleData?.decodedPolyline
  //   ? googleData?.decodedPolyline
  //   : null;

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer1",
      data: OsrmVanilla,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      pointType: "circle",
      lineWidthScale: 44,
      lineWidthMaxPixels: 10,
      lineWidthMinPixels: 8,
      // strokeColor: [55, 103, 210],
      getLineColor: [55, 103, 210],
      getPointRadius: 100,
      getLineWidth: 4,
      getElevation: 30,
      wireframe: true,
    }),

    // new GeoJsonLayer({
    //   id: "geojson-layer2",
    //   data: geoJsonData,
    //   pickable: true,
    //   stroked: true,
    //   filled: true,
    //   extruded: true,
    //   pointType: "circle",
    //   lineWidthScale: 20,
    //   lineWidthMaxPixels: 5,
    //   lineWidthMinPixels: 3,
    //   getLineColor: [44, 176, 254],
    //   getPointRadius: 100,
    //   getLineWidth: 4,
    //   getElevation: 30,
    //   wireframe: true,
    // }),

    // // distance matrix layers for kenya
    // new GeoJsonLayer({
    //   id: "geojson-layer3",
    //   data: geoJsonDataKenya,
    //   pickable: true,
    //   stroked: true,
    //   filled: true,
    //   extruded: true,
    //   pointType: "circle",
    //   lineWidthScale: 20,
    //   lineWidthMaxPixels: 8,
    //   lineWidthMinPixels: 6,
    //   // strokeColor: [55, 103, 210],
    //   getLineColor: [0, 100, 0],
    //   getPointRadius: 100,
    //   getLineWidth: 22,
    //   getElevation: 30,
    //   wireframe: true,
    //   opacity: 0.8,
    // }),

    // new GeoJsonLayer({
    //   id: "geojson-layer4",
    //   data: geoJsonDataKenya,
    //   pickable: true,
    //   stroked: true,
    //   filled: true,
    //   extruded: true,
    //   pointType: "circle",
    //   lineWidthScale: 20,
    //   lineWidthMaxPixels: 5,
    //   lineWidthMinPixels: 3,
    //   getLineColor: [0, 255, 0],
    //   getPointRadius: 100,
    //   getLineWidth: 4,
    //   getElevation: 30,
    //   wireframe: true,
    //   opacity: 0.6,
    // }),

    // // distance matrix layers for Google
    // new GeoJsonLayer({
    //   id: "geojson-layer5",
    //   data: geoJsonDataGoogle,
    //   pickable: true,
    //   stroked: true,
    //   filled: true,
    //   extruded: true,
    //   pointType: "circle",
    //   lineWidthScale: 16,
    //   lineWidthMaxPixels: 6,
    //   lineWidthMinPixels: 4,
    //   // strokeColor: [55, 103, 210],
    //   getLineColor: [255, 0, 0],
    //   getPointRadius: 100,
    //   getLineWidth: 22,
    //   getElevation: 30,
    //   wireframe: true,
    //   opacity: 0.8,
    // }),
  ];

  return (
    <div>
      <DeckGLOverlay layers={[...layers]} />
    </div>
  );
};

export default RouteLayer;
