import { Collection, Feature } from "ol";
import { Point } from "ol/geom";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import CircleStyle from 'ol/style/Circle.js';
import Text from 'ol/style/Text.js';
import Stroke from "ol/style/Stroke";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { click, platformModifierKeyOnly } from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';

import locationsRaw from "../../public/locations.json"


import DragBox from 'ol/interaction/DragBox.js';
import { localLocationsObjectNonStore, map, selectedLocations } from "./stores";


export let locations = locationsRaw
export let locationsObject = Object.fromEntries(locations.map(location => [location.id, location]));



const defaultStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.max(zoom / -550 + 12, 0),
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({ color: 'blue', width: feature.get("name") == "" ? 1 : 2 })
	}),
})


const cityStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.max(zoom / -550 + 12, 0),
		fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }), // slight red tint

		stroke: new Stroke({ color: "red", width: 2 })
	}),
})

const localStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.max(zoom / -550 + 12, 0),
		fill: new Fill({
			color: 'rgba(255, 255, 0, 0.2)' // slight yellow tint
		}),
		stroke: new Stroke({ color: "yellow", width: 2, lineDash: [4, 4] })
	}),
})

const selectedStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.max(zoom / -550 + 12, 0),
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({
			color: 'white', width: 2,
		})
	}),

})

const disabledLocalStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: 5,
		fill: new Fill({
			color: 'rgba(1, 1, 1, .5)' // slight yellow tint
		}),
	}),
})

export let addLocation = function ({ name, coordinates, tags, credit, id = randomString(), ...rest }) {

	let loc = {
		name,
		coordinates,
		tags,
		credit,
		art: [],
		id,
		enabled: true,
		...rest,

	}

	locationsObject[id] = loc

	setLocations()

	locations = Object.values(locationsObject)

	return loc

}


export let selectLocationById = (id) => { }
export let zoomToLocationById = (id) => { }


export let locationsSource = new VectorSource()

export const locationsLayer = new VectorLayer({
	style: ((feature, zoom) => {

		let tags = feature.get('tags');
		let id = feature.getId()
		let enabled = feature.get("enabled")
		let name = feature.get("name")




		if (localLocationsObjectNonStore[id] && enabled == false) return disabledLocalStyle(feature, zoom)
		if (localLocationsObjectNonStore[id]) return localStyle(feature, zoom)


		if (!tags) return defaultStyle(feature, zoom)
		if (tags.includes("city")) return cityStyle(feature, zoom)
		return defaultStyle(feature, zoom)

	}),
	source: locationsSource
});


export function setLocations() {
	console.log("setLocations");

	locationsSource.clear()
	const features = Object.values(locationsObject)
		.map(p => {
			let f = new Feature({
				geometry: new Point(p.coordinates),
				...p
			})
			f.setId(p.id)
			return f
		})

	locationsSource.addFeatures(features)

}

setLocations()





const selectedFeaturesCollection = new Collection();


map.subscribe(map => {
	if (!map) return
	console.log("locations", map);

	const selectInteraction = new Select({
		condition: click,
		toggleCondition: () => false,
		multi: true,
		style: selectedStyle,
		features: selectedFeaturesCollection,
		filter: feature => feature.getGeometry().getType() === 'Point' // only points

	});

	const dragBox = new DragBox({
		condition: platformModifierKeyOnly
	});

	map.addInteraction(dragBox);
	map.addInteraction(selectInteraction);

	dragBox.on('boxstart', (evt) => {

		if (!platformModifierKeyOnly(evt.mapBrowserEvent)) {

			selectedFeaturesCollection.clear();
		}
	});

	dragBox.on('boxend', () => {
		const extent = dragBox.getGeometry().getExtent();


		map.getLayers().forEach(layer => {
			const source = layer.getSource?.();
			if (!source?.forEachFeatureIntersectingExtent) return;


			source.forEachFeatureIntersectingExtent(extent, feature => {
				if (feature.getGeometry().getType() !== 'Point') return; // skip non-points

				if (!selectedFeaturesCollection.getArray().includes(feature)) {
					selectedFeaturesCollection.push(feature);
				}
			});
		});
	});

	map.on('click', (evt) => {
		const hit = map.hasFeatureAtPixel(evt.pixel, {
			layerFilter: layer => layer === locationsLayer

		});
		if (!hit && !platformModifierKeyOnly(evt)) {
			console.log("unselect");

			selectedFeaturesCollection.clear()
		}
	});



	let selectionDebounce = null;

	function updateSelectionStore() {
		console.log("update updateSelectionStore", selectedFeaturesCollection
			.getArray());

		clearTimeout(selectionDebounce);
		selectionDebounce = setTimeout(() => {
			const newSelection = selectedFeaturesCollection
				.getArray()
				.map(f => f.getId());
			console.log(newSelection);

			selectedLocations.set(newSelection)
		}, 1);
	}

	selectedFeaturesCollection.on('change:length', updateSelectionStore);
	selectedFeaturesCollection.on('add', updateSelectionStore);



	selectLocationById = function (id) {
		const feature = locationsLayer.getSource().getFeatureById(id);
		if (!feature) return;

		const selectedFeatures = selectInteraction.getFeatures();
		selectedFeatures.clear();    // deselect previous
		selectedFeatures.push(feature); // select new
	}

	zoomToLocationById = function (id) {
		console.log("zoomToLocationById", id);
		window.umami?.track("zoomToLocationById", locationsObject[id].name)


		const feature = locationsLayer.getSource().getFeatureById(id);
		if (!feature) return;
		const geometry = feature.getGeometry();
		const coordinates = geometry.getCoordinates();


		// pan/zoom the map view
		map.getView().animate({
			center: coordinates,
			zoom: 8,       // desired zoom level
			duration: 500   // animation in ms
		});

	}



})


console.log(locations);



function randomString() {
	const len = Math.floor(Math.random() * 9) + 8; // 8–16
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const bytes = crypto.getRandomValues(new Uint8Array(len));
	return [...bytes].map(b => chars[b % chars.length]).join('');
}