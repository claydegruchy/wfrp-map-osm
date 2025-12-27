import { Feature } from "ol";
import rawLocatons from "../../public/data.json";
import { Point } from "ol/geom";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import CircleStyle from 'ol/style/Circle.js';

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




const defaultStyle = new Style({
	image: new CircleStyle({
		radius: 6,
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({ color: 'blue', width: 2 })
	}),
})


const cityStyle = new Style({
	image: new CircleStyle({
		radius: 6,
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({ color: 'red', width: 2 })
	}),
})


const selectedStyle = new Style({
	image: new CircleStyle({
		radius: 6,
		fill: new Fill({ color: 'transparent' }),
		stroke: new Stroke({ color: 'white', width: 2 })
	}),
})




export const locationsLayer = new VectorLayer({
	style: ((feature) => {
		let tags = feature.get('tags');
		if (!tags) return defaultStyle
		if (tags.includes("city")) return cityStyle
		return defaultStyle

	}),
	source: new VectorSource({
		features: locations.map(p =>
			new Feature({
				geometry: new Point(p.coordinates),
				...p
			})
		)
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
			console.log('no feature selected');
			standardClickCallback(null)
		}
	});

}


