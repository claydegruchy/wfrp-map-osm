import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import * as turf from '@turf/turf';
import { locations } from './locations';
import { map } from './stores';
import { get } from 'svelte/store';


export let states = {}
let statelayers = {}

export let countries = {}
let countryLayers = {}


export function toggleCountries() {
	for (const [name, layer] of Object.entries(countryLayers)) {
		layer.setVisible(!layer.getVisible())
	}
}

export function toggleStates() {
	for (const [name, layer] of Object.entries(statelayers)) {
		layer.setVisible(!layer.getVisible())
	}
}

export function calculateBoundries(map) {

	for (const { tags, coordinates } of locations) {
		for (const tag of tags) {
			if (tag.includes("state:")) {
				if (!states[tag]) {
					states[tag] = []
					statelayers[tag] = null
				}

				states[tag].push(coordinates)
			}

			if (tag.includes("country:")) {
				if (!countries[tag]) {
					countries[tag] = []
					countryLayers[tag] = null
				}

				countries[tag].push(coordinates)
			}
		}
	}


	for (const [name, coordinates] of Object.entries(states)) {
		statelayers[name] = generateHullLayer(coordinates, randomColor(0.2))
		if (statelayers[name]) map.addLayer(statelayers[name])
	}

	for (const [name, coordinates] of Object.entries(countries)) {
		countryLayers[name] = generateConcaveHullLayer(coordinates, randomColor(0.2))
		if (countryLayers[name]) map.addLayer(countryLayers[name])
	}

}


function generateHullLayer(coordinates, color) {
	// Convert to turf points
	const turfPoints = turf.featureCollection(coordinates.map(c => turf.point(c)));

	// Compute convex hull
	let hull = turf.convex(turfPoints);





	if (hull) {
		// Convert hull coordinates to Openstatelayers Polygon
		const coords = hull.geometry.coordinates; // [[ [x, y], [x, y], ... ]]
		const polygonFeature = new Feature({
			geometry: new Polygon(coords)
		});

		polygonFeature.setStyle(new Style({
			fill: new Fill({ color }),
			stroke: new Stroke({ color: 'black', width: 2 })
		}));


		return new VectorLayer({
			// visible: false,
			source: new VectorSource({ features: [polygonFeature] })
		});
	}
}


function generateConcaveHullLayer(coordinates, color, maxEdge = 20000) {
	// Convert to turf points
	const turfPoints = turf.featureCollection(coordinates.map(c => turf.point(c)));

	// Compute concave hull
	const hull = turf.concave(turfPoints, { maxEdge });

	if (hull) {
		// Convert hull coordinates to OpenLayers Polygon
		const coords = hull.geometry.coordinates; // [[ [x, y], [x, y], ... ]]
		const polygonFeature = new Feature({
			geometry: new Polygon(coords)
		});


		polygonFeature.setStyle(new Style({
			fill: new Fill({ color }),
			stroke: new Stroke({ color: 'black', width: 2 })
		}));

		return new VectorLayer({
			visible: false,
			source: new VectorSource({ features: [polygonFeature] })
		});
	}
}


function delaunay(coordinates) {
}

function voronoi(coordinates) {
}


function randomColor(alpha = 0.2) {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	return `rgba(${r},${g},${b},${alpha})`;
}