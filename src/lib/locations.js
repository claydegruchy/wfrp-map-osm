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
import { selectedLocations } from "./stores";


export const locations = locationsRaw
export const locationsObject = Object.fromEntries(locations.map(location => [location.id, location]));



const defaultStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.max(zoom / -550 + 12, 0),
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({ color: 'blue', width: 2 })
	}),
})


const cityStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.max(zoom / -550 + 12, 0),
		fill: new Fill({ color: 'rgba(255, 0, 0, 0.2)' }), // slight red tint

		stroke: new Stroke({ color: "red", width: 2 })
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
	text: new Text({   // ✅ must be a Text instance
		text: feature.get('name') || "Unnamed",
		offsetY: -50,
		scale: 2,
		fill: new Fill({ color: '#fff' }),
		stroke: new Stroke({ color: '#000', width: 20 })
	})

})




export const locationsLayer = new VectorLayer({
	style: ((feature, zoom) => {

		// if (zoom >= 3000) return null
		let tags = feature.get('tags');
		if (!tags) return defaultStyle(feature, zoom)
		if (tags.includes("city")) return cityStyle(feature, zoom)
		return defaultStyle(feature, zoom)

	}),
	source: new VectorSource({
		features: locations.map(p => {
			let f = new Feature({
				geometry: new Point(p.coordinates),
				...p
			})
			f.setId(p.id)
			return f
		})
	})
});






const selectedFeaturesCollection = new Collection();


import { shiftKeyOnly } from 'ol/events/condition';
import { getIntersection } from 'ol/extent';
export function setupLocations(map, standardClickCallback = (a) => { }) {
	const selectInteraction = new Select({
		condition: click,
		toggleCondition: () => false,
		multi: true,
		style: selectedStyle,
		features: selectedFeaturesCollection,
	});

	const dragBox = new DragBox({
		condition: platformModifierKeyOnly
	});

	map.addInteraction(dragBox);
	map.addInteraction(selectInteraction);

	dragBox.on('boxstart', () => {
		selectedFeaturesCollection.clear();
	});

	dragBox.on('boxend', () => {
		const extent = dragBox.getGeometry().getExtent();

		map.getLayers().forEach(layer => {
			const source = layer.getSource?.();
			if (!source?.forEachFeatureIntersectingExtent) return;

			source.forEachFeatureIntersectingExtent(extent, feature => {
				if (!selectedFeaturesCollection.getArray().includes(feature)) {
					selectedFeaturesCollection.push(feature);
				}
			});
		});
	});

	map.on('click', (evt) => {
		const hit = map.hasFeatureAtPixel(evt.pixel);
		if (!hit) {
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
			selectedLocations.set(newSelection)
		}, 1);
	}

	selectedFeaturesCollection.on('change:length', updateSelectionStore);
	selectedFeaturesCollection.on('add', updateSelectionStore);



	function selectFeatureById(id) {
		const feature = locationsLayer.getSource().getFeatureById(id);
		if (!feature) return;

		const selectedFeatures = selectInteraction.getFeatures();
		selectedFeatures.clear();    // deselect previous
		selectedFeatures.push(feature); // select new
	}

	function zoomToLocationById(id) {
		console.log("zoomToLocationById", id);

		const feature = locationsLayer.getSource().getFeatureById(id);
		if (!feature) return;
		const geometry = feature.getGeometry();
		const coordinates = geometry.getCoordinates();
		console.log("zoom to", coordinates);

		// pan/zoom the map view
		map.getView().animate({
			center: coordinates,
			zoom: 8,       // desired zoom level
			duration: 500   // animation in ms
		});

	}

	return [selectFeatureById, zoomToLocationById]

}


