// components/LocationDetails.js

import React from "react";

const LocationDetails = ({ location }: any) => {
  return (
    <div className="absolute -z-0 w-[396px] max-w-[400px] p-6 bg-white border border-gray-200 rounded-lg shadow ml-3 text-black text-[16px]">
      <h2 className="text-xl font-medium text-gray-900 mb-4 underline underline-offset-4">
        Location Details
      </h2>
      <p>
        <strong>Name:</strong> {location.name}
      </p>
      <p>
        <strong>Label:</strong> {location.label}
      </p>
      <p>
        <strong>ID:</strong> {location.id}
      </p>
      <p>
        <strong>Source:</strong> {location.source}
      </p>
      <p>
        <strong>Source ID:</strong> {location.source_id}
      </p>
      <p>
        <strong>Layer:</strong> {location.layer}
      </p>
      <p>
        <strong>Match Type:</strong> {location.match_type}
      </p>
      <p>
        <strong>Distance:</strong> {location.distance} meters
      </p>
      <p>
        <strong>Confidence:</strong> {location.confidence}
      </p>
      <p>
        <strong>GID:</strong> {location.gid}
      </p>
    </div>
  );
};

export default LocationDetails;
