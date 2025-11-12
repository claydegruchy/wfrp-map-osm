import "./App.css";
import { MapView } from "./MapView";
import { ControlPanel, SearchBox } from "./Controls";
import { useState } from "react";

import { Geometry, Point } from "ol/geom";
import { LoginDialog, HelpDialog } from "./DialogBoxes";
import {
  GetPoints,
  AddPoint,
  DeletePoint,
  auth,
  GetPaths,
  AddPath,
  GetPoint,
} from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

import { AddBulkPoints } from "./Utilities";

export const findPoint = (points, id) => points.find((p) => p.id == id);

function App() {
  const [user, loading, error] = useAuthState(auth);

  const [points, setPoints] = useState([]);
  const [paths, setPaths] = useState([]);

  // point selection
  const [selectedPoints, setSelectedPoints] = useState([]);
  // relates to opening dialog boxes from within the map
  const [addPointDialogOpen, setAddPointDialogOpen] = useState(false);
  const [addPointDialogCoordinate, setAddPointDialogCoordinate] =
    useState(false);

  const [mapCommunications, setMapCommunications] = useState(null);

  const PreSelectPoint = () => {
    const url = new URLSearchParams(location.search);
    var id = url.get("id");
    if (!id || mapCommunications) return;
    var target = points.find((p) => p.id == id);
    if (!target) return;
    setSelectedPoints([target]);
    let t = new URL(location.href);
    t.searchParams.delete("id", null);
    // remove this so we dont repeatedly open the same point
    // window.history.pushState(null, "", t.href);
  };

  useEffect(
    (e) => {
      // only do this once
      PreSelectPoint();
    },
    [mapCommunications]
  );

  const openControls = selectedPoints.length > 0 || addPointDialogOpen;

  const openPointDialogHook = ({ coordinates }) => {
    setAddPointDialogOpen(true);
    setAddPointDialogCoordinate(coordinates);
  };

  const closePointDialogHook = () => {
    setAddPointDialogOpen(false);
    setAddPointDialogCoordinate(null);
  };

  const updatePaths = async (unprocessedPoints) => {
    if (unprocessedPoints.length < 1) return;
    console.log("[updatePaths]", unprocessedPoints.length);
    // we query enmasse and update the paths locally to not spam firestore
    const unprocessedPaths = (await GetPaths()) || [];
    const processedPaths = [];
    unprocessedPaths.forEach(async (path) => {
      path.source_point = findPoint(unprocessedPoints, path.source_id);
      path.destination_point = findPoint(
        unprocessedPoints,
        path.destination_id
      );
      path.vector = [
        path.source_point.coordinates,
        path.destination_point.coordinates,
      ];
      processedPaths.push(path);
    });
    console.log({ processedPaths });
    setPaths(processedPaths);
  };

  useEffect(
    (e) => {
      // only do this once
      updatePaths(points);
    },
    [points]
  );

  const updateFirebaseElements = async () => {
    const unprocessedPoints = (await GetPoints()) || [];
    setPoints(unprocessedPoints);

    updatePaths(unprocessedPoints);
    PreSelectPoint();
  };

  const deselectPoint = (i) =>
    setSelectedPoints(selectedPoints.filter((item, index) => index != i));

  const addNewPointHook = async ({ pointData, imageFiles, thumbnail }) => {
    console.log("[addNewPointHook]", { pointData });
    let point = {
      public: false,
      coordinates: addPointDialogCoordinate,
      ...pointData,
    };
    console.log("[addNewPointHook]", { point });

    await AddPoint({ point, imageFiles, thumbnail });
    await updateFirebaseElements();
  };

  const removePointHook = async (id) => {
    // where owner is user,
    // console.table(selectedPoints)
    // console.table()
    await DeletePoint(id)
      .then(() => setSelectedPoints(selectedPoints.filter((p) => p.id != id)))
      .catch(console.error);

    await updateFirebaseElements();
  };

  const zoomToPoint = (point) => {
    // map.getView().fit(extent, map.getSize(), { duration: 1000 });
    console.log(point, mapCommunications.getView());
    mapCommunications.getView().fit(new Point(point.coordinates), {
      padding: [100, 100, 100, 100],
      maxZoom: 8,

      duration: 1000,
    });

    console.log("zoomToPoint", point, mapCommunications.getView());
  };

  return (
    <div className="App flex h-screen">
      {/* enable for bulk addition operations */}
      {/* <AddBulkPoints addNewPointHook={addNewPointHook} points={points} /> */}
      <div className=" absolute flex gap-2 z-10 top-2 left-2">
        <LoginDialog authChangeHook={updateFirebaseElements} />
        <HelpDialog />
        {mapCommunications ? (
          <SearchBox
            locations={points}
            onSelect={zoomToPoint}
          />
        ) : (
          ""
        )}
      </div>
      <div className=" absolute flex z-10 bottom-0 ">
        {openControls ? (
          <ControlPanel
            points={points}
            selectedPoints={selectedPoints}
            deselectPoint={deselectPoint}
            addNewPointHook={addNewPointHook}
            removePointHook={removePointHook}
            addPointDialogOpen={addPointDialogOpen}
            closePointDialog={closePointDialogHook}
            user={user}
          />
        ) : null}
      </div>

      <MapView
        points={points}
        setSelectedPoints={setSelectedPoints}
        newLocationHook={openPointDialogHook}
        addPointDialogOpen={addPointDialogOpen}
        user={user}
        setMapCommunications={setMapCommunications}
        paths={paths}
        updatePaths={updateFirebaseElements}
        className={"flex-1"}
      ></MapView>
    </div>
  );
}

export default App;
