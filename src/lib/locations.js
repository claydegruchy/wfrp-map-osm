import { Feature } from "ol";
import rawLocatons from "../../public/data.json";
import { Point } from "ol/geom";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import CircleStyle from 'ol/style/Circle.js';
import Text from 'ol/style/Text.js';
import Stroke from "ol/style/Stroke";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { click } from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';

export const locations = rawLocatons.points.map(e => ({
	name: e.name,
	credit: e.credit,
	coordinates: e.coordinates,
	tags: e.tags,
	id: e.id,

}))



let dashOffset = 0



const defaultStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.abs(zoom / 550 - 12),
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({ color: 'blue', width: 2 })
	}),
})


const cityStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.abs(zoom / 550 - 12),
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({ color: 'red', width: 2 })
	}),
})


const selectedStyle = (feature, zoom) => new Style({
	image: new CircleStyle({
		radius: Math.abs(zoom / 550 - 12),
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({
			color: 'white', width: 2, lineDash: [4, 4],
			lineDashOffset: dashOffset
		})
	}),
	text: new Text({   // ✅ must be a Text instance
		text: feature.get('name') || "Unnamed",
		offsetY: -12,
		scale: 2,
		fill: new Fill({ color: '#fff' }),
		stroke: new Stroke({ color: '#000', width: 20 })
	})

})




export const locationsLayer = new VectorLayer({
	style: ((feature, zoom) => {

		if (zoom >= 3000) return null



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


export function setupLocations(map, standardClickCallback = (a) => { }) {
	const selectInteraction = new Select({
		condition: click,
		toggleCondition: () => false,
		multi: false,
		style: selectedStyle
	});

	map.addInteraction(selectInteraction);
	selectInteraction.on('select', (evt) => {
		const selectedFeatures = selectInteraction.getFeatures();

		if (evt.selected.length > 0) {
			// clicked a feature: keep it selected
			selectedFeatures.clear();
			evt.selected.forEach(f => selectedFeatures.push(f));

			const f = evt.selected[0];
			const id = f.getId();
			const name = f.get('name');
			const tags = f.get('tags');
			const coordinates = f.getGeometry().getCoordinates();
			standardClickCallback({ id, name, coordinates, tags })


		} else {
			// clicked background: clear selection
			selectedFeatures.clear();
			standardClickCallback(null)
		}
	});


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


