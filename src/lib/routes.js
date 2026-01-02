


import { Feature } from "ol"
import { paths } from "../../public/data.json"
import { LineString } from "ol/geom"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Stroke, Style } from "ol/style"
import { locations, locationsObject } from "./locations"
import routesRaw from "../../public/routes.json"
import DragBox from "ol/interaction/DragBox"
import { platformModifierKeyOnly } from "ol/events/condition"
import { extend } from "ol/extent"
import { isDev, map } from "./stores"


console.log(routesRaw.filter(routes => {
	if (!locationsObject[routes.source_id]) {
		console.log(routes.source_id, "missing");
		return true
	}
	if (!locationsObject[routes.destination_id]) {
		console.log(routes.destination_id, "missing");
		return true
	}

}));


export let routes = routesRaw.map(routes => ({
	...routes,
	length: computeDistance(locationsObject[routes.source_id].coordinates, locationsObject[routes.destination_id].coordinates)
}))
export let routesObject = Object.fromEntries(routes.map(route => [route.source_id + ":" + route.destination_id, route]))



export let routeSource = new VectorSource()
export let pathSource = new VectorSource()

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

const pathStyle = new Style({
	stroke: new Stroke({
		width: 3,
		color: 'red'
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

export const pathLayer = new VectorLayer({
	source: pathSource,
	style: pathStyle
})


export function toggleRoutes(force = null) {
	routesLayer.setVisible(force == null ? !routesLayer.getVisible() : force)
}
toggleRoutes()


export function setRoutes() {
	routeSource.clear()

	const features = routes
		.filter(r => r.enabled)
		.map(({ source_id, destination_id, ...rest }) => {
			let f = new Feature({
				geometry: new LineString([locationsObject[source_id].coordinates, locationsObject[destination_id].coordinates]),
				...rest
			})
			f.setId(source_id + ":" + destination_id)
			return f
		}
		)



	routeSource.addFeatures(features)
	routesObject = Object.fromEntries(routes.map(route => [route.source_id + ":" + route.destination_id, route]))
}


export function setPath({ pathRouteIds }) {
	pathSource.clear()

	let path = []
	for (const pathId of pathRouteIds) {
		// console.log(routesObject[pathId], routesObject);
		path.push(routesObject[pathId])
	}


	const features = path.map(({ source_id, destination_id, ...rest }) => {
		let f = new Feature({
			geometry: new LineString([locationsObject[source_id].coordinates, locationsObject[destination_id].coordinates]),
			...rest
		})
		f.setId("path:" + source_id + destination_id)
		return f
	}
	)

	pathSource.addFeatures(features)


}
setRoutes()


export let zoomToEncompass = function ({ pathNodes }, padding = 100, duration = 1000) { }
export let addRoute = ({ source_id, destination_id, enabled = true, type = "road" }) => {

}


map.subscribe(map => {
	if (!map) return
	if (isDev) {
		const dragBox = new DragBox({
			condition: platformModifierKeyOnly, // Ctrl on Windows/Linux, Cmd on macOS
		});

		map.addInteraction(dragBox);

		dragBox.on("boxend", () => {
			const extent = dragBox.getGeometry().getExtent();

			const toUpdate = [];
			routeSource.forEachFeatureIntersectingExtent(extent, (feature) => {
				toUpdate.push(feature.getId());
			});

			for (const id of toUpdate) {
				if (routesObject[id]) {
					// make water
					// routesObject[id].type = "water"
					// remove
					routesObject[id].enabled = false
				}
			}
			// console.log(toUpdate.length, toUpdate);

			routes = Object.values(routesObject)
			setRoutes()
			console.log(locations, routes);




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
			console.log(locations, routes);


			pendingId = null
		})
	}



	addRoute = ({ source_id, destination_id, enabled = true, type = "road" }) => {
		if (!locationsObject[source_id] || !locationsObject[destination_id]) {
			console.error("location add error",
				"source_id:",
				locationsObject[source_id],
				"destination_id:",
				locationsObject[destination_id]
			)
			return
		}
		let newRoute = {
			source_id, destination_id, enabled, type,
			length: computeDistance(locationsObject[source_id].coordinates, locationsObject[destination_id].coordinates)

		}
		routes.push(newRoute)
		setRoutes()

		return newRoute

	}

	zoomToEncompass = function ({ pathNodes }, padding = 100, duration = 1000) {

		let coordsArray = pathNodes.map(n => locationsObject[n].coordinates)


		if (!coordsArray || coordsArray.length === 0) return

		const projected = coordsArray
		let extent = [projected[0][0], projected[0][1], projected[0][0], projected[0][1]]
		for (let i = 1; i < projected.length; i++) {
			extent = extend(extent, [projected[i][0], projected[i][1], projected[i][0], projected[i][1]])
		}

		map.getView().fit(extent, { padding: [padding, padding, padding, padding], duration })

	}


})


export function findPath(startId, endId) {
	{
		const graph = {}
		const nameGraph = {}


		// build adjacency with weights
		for (const key in routesObject) {
			const { source_id, destination_id, enabled, ...rest } = routesObject[key]
			if (!enabled) continue

			// compute weight (currently distance, can change later)
			const weight = rest.length

			graph[source_id] ??= []
			graph[destination_id] ??= []

			graph[source_id].push({ node: destination_id, weight, routeId: key })
			graph[destination_id].push({ node: source_id, weight, routeId: key }) // undirected

			nameGraph[source_id + destination_id] = key
			nameGraph[destination_id + source_id] = key
		}

		// Dijkstra
		const distances = {}
		const previous = {}
		const routeUsed = {}
		const visited = new Set()
		const queue = new Set(Object.keys(graph))

		for (const node of queue) distances[node] = Infinity
		distances[startId] = 0

		while (queue.size) {
			// pick node with smallest distance (weight)
			let current = null
			for (const n of queue) {
				if (current === null || distances[n] < distances[current]) current = n
			}
			queue.delete(current)
			visited.add(current)

			if (current === endId) break

			for (const { node: neighbor, weight, routeId } of graph[current]) {
				if (visited.has(neighbor)) continue
				const alt = distances[current] + weight
				if (alt < distances[neighbor]) {
					distances[neighbor] = alt
					previous[neighbor] = current
					routeUsed[neighbor] = routeId
				}
			}
		}

		// reconstruct path
		if (!previous[endId]) return { pathNodes: null, pathRouteIds: null }

		const pathNodes = []
		const pathRouteIds = []
		let current = endId
		while (current !== startId) {
			pathNodes.unshift(current)
			pathRouteIds.unshift(routeUsed[current])
			current = previous[current]
		}
		pathNodes.unshift(startId)
		console.log({ pathRouteIds });

		return { pathNodes, pathRouteIds }
	}

}


// let re = findPath(routes, "ZzxEIjTJwDVY4UHpXGzd", "i5xZQabC5G69fLeA8Nm6")
// let path = findPath("ZzxEIjTJwDVY4UHpXGzd", "cL30w9UailtiheDMkqTR")






export function meterConv(m) {
	return Math.round(m * 0.0006213712 * 0.2355808286)
	1231

	// 320 (290 / 350) miles Road

}

function computeDistance(a, b) {
	const [x1, y1] = a
	const [x2, y2] = b
	const dx = x2 - x1
	const dy = y2 - y1
	return Math.sqrt(dx * dx + dy * dy)
}

export function getCardinalDirection(a, b, short = true) {
	const dx = b[0] - a[0]
	const dy = b[1] - a[1]

	const angle = Math.atan2(dy, dx) * (180 / Math.PI) // convert to degrees

	if (short) {


		if (angle >= -22.5 && angle < 22.5) return 'E'
		if (angle >= 22.5 && angle < 67.5) return 'NE'
		if (angle >= 67.5 && angle < 112.5) return 'N'
		if (angle >= 112.5 && angle < 157.5) return 'NW'
		if (angle >= 157.5 || angle < -157.5) return 'W'
		if (angle >= -157.5 && angle < -112.5) return 'SW'
		if (angle >= -112.5 && angle < -67.5) return 'S'
		if (angle >= -67.5 && angle < -22.5) return 'SE'

	}
	else {

		if (angle >= -22.5 && angle < 22.5) return 'East'
		if (angle >= 22.5 && angle < 67.5) return 'Northeast'
		if (angle >= 67.5 && angle < 112.5) return 'North'
		if (angle >= 112.5 && angle < 157.5) return 'Northwest'
		if (angle >= 157.5 || angle < -157.5) return 'West'
		if (angle >= -157.5 && angle < -112.5) return 'Southwest'
		if (angle >= -112.5 && angle < -67.5) return 'South'
		if (angle >= -67.5 && angle < -22.5) return 'Southeast'
	}

}
