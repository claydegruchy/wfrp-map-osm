


import { Feature } from "ol"
import { paths } from "../../public/data.json"
import { LineString } from "ol/geom"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Stroke, Style } from "ol/style"
import { locationsObject } from "./locations"
import routesRaw from "../../public/routes.json"
import DragBox from "ol/interaction/DragBox"
import { platformModifierKeyOnly } from "ol/events/condition"

export let routes = routesRaw
export let routesObject = Object.fromEntries(routes.map(route => [route.source_id + route.destination_id, route]))

export let routeSource = new VectorSource()

const routeStyleRoad = new Style({
	stroke: new Stroke({
		width: 5,
	})
})

const routeStyleWater = new Style({
	stroke: new Stroke({
		width: 3,
		color: 'blue'
	})
})


export const routesLayer = new VectorLayer({
	source: routeSource,

	style: ((feature, zoom) => {
		let type = feature.get('type');
		if (type == "road") return routeStyleRoad
		if (type == "water") return routeStyleWater
		return routeStyleRoad
	})

})


export function setRoutes() {
	routeSource.clear()

	const features = routes.filter(r => r.enabled).map(({ source_id, destination_id, ...rest }) => {
		let f = new Feature({
			geometry: new LineString([locationsObject[source_id].coordinates, locationsObject[destination_id].coordinates]),
			...rest
		})
		f.setId(source_id + destination_id)
		return f
	}
	)



	routeSource.addFeatures(features)
	routesObject = Object.fromEntries(routes.map(route => [route.source_id + route.destination_id, route]))
}

setRoutes()


export function setupRoutes(map) {
	console.log("setupRoutes");

	const dragBox = new DragBox({
		condition: platformModifierKeyOnly, // Ctrl on Windows/Linux, Cmd on macOS
	});

	map.addInteraction(dragBox);

	dragBox.on("boxend", () => {
		const extent = dragBox.getGeometry().getExtent();

		const toRemove = [];
		routeSource.forEachFeatureIntersectingExtent(extent, (feature) => {
			toRemove.push(feature.getId());
		});

		for (const id of toRemove) {
			if (routesObject[id]) routesObject[id].enabled = false
		}
		routes = Object.values(routesObject)
		setRoutes()
		console.log(routes);


	});



	let pendingId = null
	map.on('singleclick', evt => {
		if (!platformModifierKeyOnly(evt)) return

		const feature = map.forEachFeatureAtPixel(
			evt.pixel,
			f => f,
			{
				layerFilter: layer => layer !== routesLayer
			}
		)

		if (!feature) return
		console.log(feature);

		const id = feature.getId()

		if (!pendingId) {
			pendingId = id
			return
		}


		console.log("id path from",
			id, "to",
			pendingId);

		console.log("path from",
			locationsObject[id].name, "to",
			locationsObject[pendingId].name);

		const r = {
			source_id: id,
			destination_id: pendingId,
			enabled: true,
			type: 'road',
		}
		console.log(r);

		routes = [...routes, r]
		setRoutes()
		console.log(routes);


		pendingId = null
	})





}



