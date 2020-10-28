import "./App.css";
import { StaticMap } from "react-map-gl";
import { useState } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import data from "./gundata.json";

function App() {
  const token = process.env.REACT_APP_MAPBOX_TOKEN;
  const [viewport, setViewport] = useState({
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 8,
    pitch: 0,
    bearing: 0,
  });
  // const [injured, setInjured] = useState(0);
  // const [killed, setKilled] = useState(0);
  // const [incidents, setIncidents] = useState(0);

  // const [hoverInfo, setHoverInfo] = useState({});
  // console.log(hoverInfo.object);

  const scatterplot = () =>
    new ScatterplotLayer({
      id: "scatter",
      data: data,
      opacity: 0.8,
      filled: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 5,
      getPosition: (d) => [d.longitude, d.latitude],
      getFillColor: (d) =>
        d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
      // pickable: true,
      // // Update app state
      // onHover: (info) => setHoverInfo(info),
    });
  const heatmap = () =>
    new HeatmapLayer({
      id: "heat",
      data: data,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.n_killed + d.n_injured * 0.5,
      radiusPixels: 60,
      // pickable: true,
      // // Update app state
      // onHover: (info) => setHoverInfo(info),
    });

  const hexagon = () =>
    new HexagonLayer({
      id: "hex",
      data: data,
      getPosition: (d) => [d.longitude, d.latitude],
      getElevationWeight: (d) => d.n_killed * 2 + d.n_injured,
      elevationScale: 100,
      extruded: true,
      radius: 800,
      opacity: 0.6,
      coverage: 0.88,
      lowerPercentile: 50,
      // pickable: true,
      // // Update app state
      // onHover: (info) => {
      //   console.log("info", info.object?.points);
      //   const numberOfIncidents = info.object?.points?.length;

      //   let numberOfInjured = 0;
      //   let numberOfKilled = 0;

      //   if (numberOfIncidents > 0) {
      //     const total = info.object?.points?.map((point) => {
      //       numberOfInjured = parseInt(point.n_injured) + numberOfInjured;
      //       numberOfKilled = parseInt(point.n_killed) + numberOfKilled;
      //       return numberOfKilled, numberOfInjured;
      //     });

      //     setInjured(numberOfInjured);
      //     setKilled(numberOfKilled);
      //     setIncidents(numberOfIncidents);
      //   }
      // },
    });
  const layers = [scatterplot(), heatmap(), hexagon()];

  return (
    <DeckGL
      controller={true}
      initialViewState={viewport}
      layers={layers}

      // onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      <StaticMap
        mapboxApiAccessToken={token}
        mapStyle="mapbox://styles/yashp/ckgttjmld02s019mkng300g75"
      >
        {/* {incidents > 0 ? (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              pointerEvents: "none",
              left: hoverInfo.x,
              top: hoverInfo.y,
              display: "block",
            }}
          >
            <p>{injured}</p>
            <p>{killed}</p>
          </div>
        ) : null} */}
      </StaticMap>
    </DeckGL>
  );
}

export default App;
