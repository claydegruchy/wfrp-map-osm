import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke, Text } from 'ol/style';
import * as turf from '@turf/turf';
import { locations } from './locations';
import { map } from './stores';
import { get } from 'svelte/store';
import { Point } from 'ol/geom';




export let states = {}
let stateLayers = {}

export let countries = {}
let countryLayers = {}


export function toggleCountries() {

	for (const [name, layer] of Object.entries(countryLayers)) {
		layer.setVisible(!layer.getVisible())
	}
}

export function toggleStates() {
	for (const [name, layer] of Object.entries(stateLayers)) {
		layer.setVisible(!layer.getVisible())
	}
}


map.subscribe(map => {
	if (!map) return
	calculateBoundries(map)
})

export function calculateBoundries(map) {
	for (const { tags, coordinates } of locations) {
		for (const tag of tags) {
			if (tag.includes("state:")) {
				if (!states[tag]) {
					states[tag] = []
					stateLayers[tag] = null
					console.log({ tag });

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
		stateLayers[name] = generateHullLayer(coordinates, randomColor(0.2), name.split(":").at(-1).toLocaleUpperCase())
		if (stateLayers[name]) map.addLayer(stateLayers[name])
	}

	for (const [name, coordinates] of Object.entries(countries)) {
		countryLayers[name] = generateHullLayer(coordinates, randomColor(0.2), name.split(":").at(-1).toLocaleUpperCase())
		if (countryLayers[name]) map.addLayer(countryLayers[name])
	}



}





function generateHullLayer(coordinates, color, name) {
	// Convert to turf points
	const turfPoints = turf.featureCollection(coordinates.map(c => turf.point(c)));

	// Compute convex hull
	let hull = turf.convex(turfPoints);





	if (hull) {
		// Convert hull coordinates to OpenstateLayers Polygon
		const coords = hull.geometry.coordinates; // [[ [x, y], [x, y], ... ]]
		const polygon = new Polygon(coords)
		const polygonFeature = new Feature({
			geometry: polygon
		});

		const center = polygon.getInteriorPoint().getCoordinates();


		polygonFeature.setStyle(new Style({
			fill: new Fill({ color }),
			stroke: new Stroke({ color: 'black', width: 2 })
		}));


		const pointFeature = new Feature({
			geometry: new Point(center)
		});


		const baseZoom = 7; // zoom where size looks correct

		const style = feature => {
			const zoom = get(map).getView().getZoom();
			// const scale = Math.min(Math.pow(2, baseZoom - zoom), 5);
			// let lilscale = Math.max(zoom / -550 + 12, 0)
			let scale = Math.pow(2, baseZoom - zoom);

			// clamp between 2 and 3
			if (scale < 2) scale = 2;
			if (scale > 3) scale = 3;




			return new Style({
				text: new Text({
					text: name,
					scale,
					font: '10px sans-serif', // make it huge
					stroke: new Stroke({
						color: '#fff',
						width: 1
					}),
				})
			});
		};



		pointFeature.setStyle(style)



		let vector = new VectorLayer({
			visible: false,
			source: new VectorSource({ features: [polygonFeature, pointFeature] }),
			style: feature => new Style({
				text: new Text({
					text: 'MASSIVE',
					font: '200px sans-serif', // make it huge
					fill: new Fill({ color: '#000' }),
					stroke: new Stroke({
						color: '#fff',
						width: 8
					}),
					textAlign: 'center',
					textBaseline: 'middle',
					overflow: true // allow text beyond geometry
				})

			})
		});

		return vector
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

function polygonCentroid(coords) {
	// drop duplicate closing point if present
	if (
		coords.length > 2 &&
		coords[0][0] === coords[coords.length - 1][0] &&
		coords[0][1] === coords[coords.length - 1][1]
	) {
		coords = coords.slice(0, -1);
	}

	let area = 0;
	let cx = 0;
	let cy = 0;

	for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
		const x0 = coords[j][0];
		const y0 = coords[j][1];
		const x1 = coords[i][0];
		const y1 = coords[i][1];

		const f = x0 * y1 - x1 * y0;
		area += f;
		cx += (x0 + x1) * f;
		cy += (y0 + y1) * f;
	}

	area *= 0.5;

	// fallback: bounds center if degenerate
	if (area === 0) {
		let minX = Infinity, minY = Infinity;
		let maxX = -Infinity, maxY = -Infinity;
		for (const [x, y] of coords) {
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}
		return [(minX + maxX) / 2, (minY + maxY) / 2];
	}

	return [cx / (6 * area), cy / (6 * area)];
}
