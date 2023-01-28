import './style.css';
import { Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control.js';

import ImageLayer from 'ol/layer/Image.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';
import { getCenter } from 'ol/extent.js';
import XYZ from 'ol/source/XYZ.js';
import { createStringXY } from 'ol/coordinate.js';
import { boundingExtent } from 'ol/extent.js';

import { transformExtent, transform } from 'ol/proj';

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

// image placer



// new ImageLayer({
//   source: new Static({
//     attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
//     url: 'https://imgs.xkcd.com/comics/online_communities.png',
//     // url: '/marienberg.tiff',

//     projection: projection,
//     imageExtent: extent,
//   }),
// }),
// new TileLayer({
//   source: new OSM()
// }), 

var mercatorExtent = [0, 0, 300000, 300000];


var x = transformExtent(mercatorExtent, 'EPSG:3857', 'EPSG:4326');
// console.log(transform([-16, 32], 'EPSG:4326', 'EPSG:3857'));
transform([-16, 32], 'EPSG:4326', 'EPSG:3857')


// aldorf size
// 3366 × 3248



const map = new Map({
  target: 'map',
  controls: defaultControls().extend([mousePositionControl]),

  layers: [
    // main map
    new TileLayer({
      maxZoom: 7,
      source: new XYZ({
        url:
          'http://www.gitzmansgallery.com/tiles/{z}_{x}_{y}.jpg'
      }),
    }),
    // city
    new ImageLayer({
      // minZoom: 5,



      source: new Static({
        url:
          '/Map-City-Altdorf-4-Color.jpg',
        crossOrigin: '',
        projection: 'EPSG:3857',

        // imageExtent: boundingExtent([transform([0, 49], "EPSG:4326", "EPSG:32661"),
        // transform([10, 55], "EPSG:4326", "EPSG:32661")]),

        // imageExtent: [-1852995.9934683219, 3839394.002326335,-1754102.8280948512, 3755827.8914180356],
        imageExtent: [0, 0, 300000, 300000],

        // imageExtent: [-2397440.0539429057, 4246479.048244938, -926984.7401089855, 3146059.53083352],

        interpolate: false,
        opacity: 0.5
      })
    })
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
  console.log(event.coordinate);
})
