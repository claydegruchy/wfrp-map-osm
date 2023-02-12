import React from "react";
import "ol/ol.css";
import { Map } from "@react-ol/fiber";

export const MapView = ({className}) => (
  <div className={className}>
    <Map style={{ width: "100%", height: "95vh" }}>
      <olView initialCenter={[0, 0]} initialZoom={2} />
      <olLayerTile preload={Infinity}>
        <olSourceOSM />
      </olLayerTile>
    </Map>
  </div>
);
