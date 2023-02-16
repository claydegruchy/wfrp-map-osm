import './style.css';
import { Map, View } from 'ol';
import {OverviewMap,defaults as defaultControls } from 'ol/control.js';
import { getCenter } from 'ol/extent.js';
import XYZ from 'ol/source/XYZ.js';
import { createStringXY } from 'ol/coordinate.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import { Group, Tile } from 'ol/layer.js';
import TileImage from 'ol/source/TileImage.js';


import { transform } from 'ol/proj';

//handle scrolling
import { DragPan, MouseWheelZoom, defaults } from 'ol/interaction.js';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import MousePosition from 'ol/control/MousePosition.js';

import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

// mouse tracker
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(10),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
});



const world = new XYZ({
  // url:  'http://www.gitzmansgallery.com/tiles/{z}_{x}_{y}.jpg',
  tileUrlFunction: ([z, x, y]) => {
    if (z > 7) return null
    return `http://www.gitzmansgallery.com/tiles/${z}_${x}_${y}.jpg`
  }
})

const overviewMapControl = new OverviewMap({
  collapsed:false,
  // className:'custom-overview',
  layers: [
    new TileLayer({
      source: world,
    }),
  ],
});


const map = new Map({
  target: 'map',
  controls: defaultControls().extend([mousePositionControl,overviewMapControl]),

  layers: [
    // main map
    new TileLayer({
      // maxZoom: 7,
      source: world

    }),


    new Group({
      title: 'Altdorf Overlay',
      layers: [
        new Tile({
          title: 'Altdorf Tile',
          minZoom: 7,

          // opacity: 0.7,
          source: new TileImage({
            attributions: '',
            tileGrid: new TileGrid({
              extent: [-1879572.67834710842, 3734469.05619834783, -1754782.27834710851, 3824113.85619834764],
              origin: [-1879572.67834710842, 3734469.05619834783],
              resolutions: [537.600000000000023, 268.800000000000011, 134.400000000000006, 67.2000000000000028, 33.6000000000000014, 16.8000000000000007, 8.40000000000000036, 4.20000000000000018],
              tileSize: [256, 256]
            }),
            tileUrlFunction: function (tileCoord) {
              return ('./altdorf/{z}/{x}/{y}.png'
                .replace('{z}', String(tileCoord[0]))
                .replace('{x}', String(tileCoord[1]))
                .replace('{y}', String(- 1 - tileCoord[2])));
            },
          })
        }),
      ]
    }),


    new Group({
      title: 'Marienburg Overlay',
      layers: [
        new Tile({
          title: 'Marienburg Tile',
          minZoom: 7,
          // opacity: 0.7,
          source: new TileImage({
            attributions: '',
            tileGrid: new TileGrid({
              extent: [-3320017.90883266041, 4701281.93297282793, -3175634.72078718198, 4803354.42623188905],
              origin: [-3320017.90883266041, 4701281.93297282793],
              resolutions: [658.532214574588806, 329.266107287294403, 164.633053643647202, 82.3165268218236008, 41.1582634109118004, 20.5791317054559002, 10.2895658527279501, 5.14478292636397505],
              tileSize: [256, 256]
            }),
            tileUrlFunction: function (tileCoord) {
              return ('./marienburg/{z}/{x}/{y}.png'
                .replace('{z}', String(tileCoord[0]))
                .replace('{x}', String(tileCoord[1]))
                .replace('{y}', String(- 1 - tileCoord[2])));
            },
          })
        }),
      ]
    }),
  ],



  view: new View({
    // projection: projection,
    center: getCenter([0, 0, 1024, 968]
    ),
    zoom: 2,
    // maxZoom: 7,
  }),

});
map.on('singleclick', function (event) {
  console.log(event.coordinate, transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
  // transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
})
