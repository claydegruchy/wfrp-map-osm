import { doc, setDoc, updateDoc } from "firebase/firestore";
import { generateThumbAndAdd } from "./Controls";

import { AddPath, db } from "./firebase";

export const AddBulkPoints = ({ addNewPointHook, points }) => {
  let positions = [
    [-1233196.4642176593, 2608545.086931491],
    [-1233247.3724728257, 2606158.221290429],
    [-1229865.257907813, 2606329.980667465],
    [-1228654.432677526, 2606954.539862447],
    [-1236872.6075467495, 2604081.8810767764],
    [-1228344.131186724, 2605256.2792857713],
    [-1227945.8226096442, 2603229.279771041],
    [-1230634.4055049326, 2603992.3064342546],
    [-1237719.8343739337, 2602527.014573671],
    [-1238924.6133158505, 2601936.9416160593],
    [-1229944.9793396574, 2603617.361909766],
    [-1234073.9224866948, 2599652.265713008],
    [-1235369.7689818419, 2600946.0967786983],
    [-1236413.910731503, 2602333.309409218],
    [-1234338.3169732045, 2601798.1009201505],
    [-1237365.4920172251, 2599277.097251913],
    [-1235775.0942392524, 2597765.450513824],
    [-1228942.7883809104, 2604029.032037689],
    [-1227805.339711956, 2599680.5563709377],
    [-1227511.5348844847, 2608591.217872389],
    [-1223717.8994826202, 2603345.129642036],
    [-1220777.0893230976, 2604482.2797288485],
    [-1231047.7178346347, 2600471.649755475],
    [-1224946.4903503407, 2601015.293190046],
    [-1229348.3375749274, 2599857.3169988473],
    [-1228519.7721316018, 2601810.342787962],
    [-1226925.8660134638, 2602883.5962964427],
    [-1231964.6635919153, 2596181.0990242218],
    [-1231205.0706233312, 2597303.543940554],
    [-1228562.917251083, 2597404.0914767846],
    [-1231873.148165472, 2598704.789931735],
    [-1226955.3509999604, 2597506.7290880075],
    [-1225725.4165126022, 2598512.7269690614],
    [-1225548.6558846927, 2597086.325432439],
    [-1229704.9192976991, 2597840.7678590775],
    [-1224244.5983806478, 2599007.9254511353],
    [-1222079.9524985757, 2600129.250684436],
    [-1236292.5370908868, 2590374.12424061],
    [-1248139.9032474111, 2598511.53264049],
    [-1232985.2919979144, 2589776.5867294525],
    [-1236513.1146480958, 2592768.5290807476],
    [-1224093.1628835266, 2587797.778292617],
    [-1220722.3197943645, 2593549.5153800054],
    [-1223855.9393719148, 2591864.093835424],
    [-1218612.8369629786, 2591655.459563884],
    [-1223589.6041014837, 2590174.6414319295],
    [-1221416.6725649785, 2589738.412922849],
    [-1219433.1913974064, 2592962.055016134],
    [-1222104.9044016867, 2592774.8440132635],
    [-1256948.013491138, 2595278.472275932],
    [-1258553.8628949455, 2596391.2132726572],
    [-1260430.3023647042, 2599289.5501225176],
    [-1255801.1594847185, 2602128.2451895652],
    [-1257393.1248189353, 2605626.58285325],
    [-1252896.1791822047, 2602189.1559464806],
    [-1253948.75587737, 2600290.6213982333],
    [-1252439.6470874858, 2596582.679071048],
    [-1243372.2299616246, 2607493.094466785],
    [-1247924.562585648, 2603530.5362182315],
    [-1244422.417999656, 2602450.639257097],
    [-1246952.9762964293, 2606153.8042700146],
    [-1244471.3108253658, 2600138.7177336123],
    [-1249606.0279168508, 2605230.737578829],
    [-1246110.004264764, 2576883.572978736],
    [-1255450.922632461, 2573592.899194631],
    [-1247531.7031326538, 2573553.7102885274],
    [-1242774.0206406496, 2572706.632752414],
    [-1242681.1615945688, 2567558.180882409],
    [-1252976.721714941, 2569642.806750495],
    [-1238441.1458908045, 2567781.8189065717],
    [-1257282.5747809587, 2574709.3724681283],
    [-1250345.6158819373, 2569541.51275891],
    [-1236633.902832394, 2570024.320082102],
    [-1215992.5461463, 2569795.7554526012],
    [-1196847.787125317, 2559149.743290132],
    [-1210709.537701083, 2571693.0297735143],
  ];
  let labels = [
    null,
    "The Palace",
    "Gedchtnisgarten",
    "Memorial Obelisk",
    "Oldenhaller Estate",
    "Richthofen Estate",
    "Erhard Estate",
    "Becker Estate",
    "Kuhn Estate",
    "Ostwald Estate",
    "The Sigmars Platz",
    "Von Spiel Estate",
    "Von Rundsted Estate",
    "Von Kliest Estate",
    "Von Speer Estate",
    "Von Hexen Estate",
    "Badendorf Estate",
    "Council Building",
    "Great Cathedral of Sigmar",
    "Gardens of Morr",
    "Temple of Myrmidia",
    "Temple of Ulric",
    "Grand Temple of Verena",
    "High Court of Nuln",
    "the Shallyan Temple and Hospital",
    "Temple of Handrich",
    "Shrine of Wendred",
    "Golden Hammer Restaurant",
    "Otto Jaegar Estate",
    "Vogt Estate",
    "City's Mint",
    "Tailor Kappelmuller",
    "Jeweller Kobbe",
    "Elven Trade Hall",
    "Imperial Bank",
    "Nuln Opera House",
    "Griffons Claw Inn",
    "Hall of Archives",
    "Granaries",
    "Town Hall",
    "Grand University of Nuln",
    "Minstrels Guild",
    "Insurance Guild",
    "Clockmaker Tissot",
    "Armourers' Guild",
    "Uter's Shop Butcher",
    "Otto's Glassworks",
    "Hofbauer-Bodelstein Trading Co",
    "Merchant Council",
    "Laughing Bear",
    "Hindelin Lines Boatyard",
    "The Fish Market",
    "Blind Pig Tavern",
    "Drunken Guardsman",
    "Frau Zorin's Room & Board",
    "The Green Bottle Inn",
    "Reavers Return",
    "Imperial Gunnery School",
    "The Eldritch Universit",
    "Academy of Wizardry",
    "Halfling University",
    "College of Barristers",
    "Nuln's College of Engineering",
    "Saucy Dwarf",
    "Richthofen Foundry",
    "Guild of Gunners",
    "The Erhard Charcoal Company",
    "Guild of Blacksmiths",
    "Glassworkers Guild",
    "Tanners' & Dyers",
    "Artillery Workshop",
    "Gunpowder Platz",
    "Sump Docks",
    "Rickard's Armour",
    "Rickard's Palace",
    "City's Garrison",
    "Wolf Company Garrison",
  ];

  const start = async () => {
    // positions.map((p, i) => ({ coordinates: p, }))

    let pn = points.map((p) => p.name);
    let POIS = positions
      .map((p, i) => ({ coordinates: p, name: labels[i], index: i }))
      .filter(({ name }) => !pn.includes(name));
    console.log({ POIS });

    // for (const { coordinates, name } of POIS.slice(4, -1)) {
    for (const { coordinates, name } of POIS) {
      if (!name) continue;
      console.log({ name });

      // return
      let imageFiles = [];
      try {
        let url = `/nuln/${name}.png`;
        const blob = await (await fetch(url)).blob();
        if (blob.size != 0) {
          imageFiles = [
            new File([blob], "fileName.png", { type: "image/png" }),
          ];
        }
        // console.log({ formData, imageFiles, addNewPointHook, mainIndex: 0 });
      } catch (error) {
        console.log("not found", name, error);
      }

      let pointData = { name, coordinates, tags: ["nuln"], public: false };
      await generateThumbAndAdd({
        pointData,
        imageFiles,
        addNewPointHook,
        mainIndex: 0,
      });
    }
  };

  // const blob = new Blob([content], { type: "image/png" });
  return (
    <button className="bg-black" onClick={() => start()}>
      AddPoints
    </button>
  );
};

export const AddBulkPaths = async ({ lines, points, paths }) => {
  console.log("AddBulkPaths", { lines, points });
  const pointFind = (coords) => {
    const i = points.findIndex(
      (p) => p.coordinates[0] == coords[0] && p.coordinates[1] == coords[1]
    );
    if (i == -1) throw new Error("not found");
    return points[i];
  };

  // remove lines that already have a path
  console.log(lines.length);
  lines = lines
    .filter((l) => {
      let s = pointFind(l[0]);
      let d = pointFind(l[1]);
      let found = paths.find(
        (p) => p.source_id == s.id && p.destination_id == d.id
      );
      return !found;
    })
    // remove reverse line duplicates
    .filter((l) => {
      let s = pointFind(l[0]);
      let d = pointFind(l[1]);
      let found = paths.find(
        (p) => p.source_id == d.id && p.destination_id == s.id
      );
      return !found;
    });
  console.log("adding", lines.length, "paths");

  let i = 0;
  for (const coordinates of lines) {
    let s = pointFind(coordinates[0]);
    let d = pointFind(coordinates[1]);

    let source_id = s.id;
    let destination_id = d.id;

    let name = `${s.name}/${d.name} route`;
    let type = "land";
    let status = "active";

    let path = { source_id, destination_id, name, type, status };
    console.log(path);
    try {
      await AddPath(path);
    } catch (error) {
      console.log(error);
    }
    i++;
    console.log(i);
  }
};

let to_update = ["FMbFSAEk51Ro0rvo2waE"];

export async function Utility_PointUpdateOperations({ lines, points, paths }) {
  console.log("starting", "Utility_PointUpdateOperations");
  // const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
  return;
  // AddPoint({ point: { coordinates: positions[0], public: false, name: "test" } })

  // GeDruchy

  let i = 0;
  for (let point of points) {
    console.log("check...");
    // if (point.name != "TESTING1") continue;
    if (!to_update.includes(point.id)) continue;
    // if (!point.tags?.includes("nuln")) continue;
    console.log("adding tags to", point.name);
    // continue;
    // if (i > 2) return;
    i += 1;
    // continue
    let pointRef = await doc(db, "points", point.id);
    await updateDoc(pointRef, {
      tags: ["city", "city:nuln"],
    });

    // let updated_point = { ...point, tags: [] };
    // console.log({ point }, { pointRef });

    // console.log("tick");
    // if (point.tags) continue;

    // delete point.owned_by_user

    //             // if (!point.credit) point.credit = "GeDruchy"
    //             // if (!point.category) point.tags = ["art"]
    //             // console.log(point);
    //             // const newPoint = sortObject(point)
    //             // console.log(newPoint);
    // console.log("setting point", point, "to", updated_point);

    // let out = await setDoc(pointRef, point);
    //             // log
  }

  //         // console.log(auth.currentUser.displayName);

  //         return points
  //     .then(console.log)
  console.log("finished", "Utility_PointUpdateOperations");
}

// simple debounce
export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
