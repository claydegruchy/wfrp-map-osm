


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
	routesObject = Object.fromEntries(routes.map(route => [route.source_id + ":" + route.destination_id, route]))
}


export function setPath({ pathNodes, pathRouteIds }) {
	pathSource.clear()
	console.log("setpath", pathRouteIds);

	let path = []
	for (const pathId of pathRouteIds) {
		console.log(routesObject[pathId], routesObject);
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



export function findShortestPath(startId, endId) {
	const graph = {}
	const nameGraph = {}

	// build adjacency with distances
	for (const key in routesObject) {
		const { source_id, destination_id, enabled } = routesObject[key]
		if (!enabled) continue


		let distance = computeDistance(locationsObject[source_id].coordinates, locationsObject[destination_id].coordinates,)

		graph[source_id] ??= []
		graph[destination_id] ??= []

		graph[source_id].push({ node: destination_id, weight: distance, routeId: key })
		graph[destination_id].push({ node: source_id, weight: distance, routeId: key }) // undirected

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
		// pick node with smallest distance
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

	return { pathNodes, pathRouteIds }
}

export function findPath(startId, endId) {
	const graph = {}
	const nameGraph = {}

	// build adjacency from routesObject
	for (const key in routesObject) {
		const { source_id, destination_id, enabled } = routesObject[key]
		if (!enabled) continue

		graph[source_id] ??= []
		graph[destination_id] ??= []

		graph[source_id].push(destination_id)
		graph[destination_id].push(source_id)

		// build a bidirectional namegraph for later
		nameGraph[source_id + destination_id] = key
		nameGraph[destination_id + source_id] = key
	}

	const queue = [[startId]]
	const visited = new Set([startId])

	while (queue.length) {
		const path = queue.shift()
		const node = path[path.length - 1]

		if (node === endId) {
			// reconstruct route IDs from routesObject
			const pathRouteIds = []
			for (let i = 1; i < path.length; i++) {
				const key = path[i - 1] + path[i]
				pathRouteIds.push(nameGraph[key])
			}
			return { pathNodes: path, pathRouteIds }
		}

		for (const neighbor of graph[node] ?? []) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor)
				queue.push([...path, neighbor])
			}
		}
	}

	return { pathNodes: null, pathRouteIds: null }
}




// let re = findPath(routes, "ZzxEIjTJwDVY4UHpXGzd", "i5xZQabC5G69fLeA8Nm6")
// let path = findPath("ZzxEIjTJwDVY4UHpXGzd", "cL30w9UailtiheDMkqTR")
let path = findPath("ZzxEIjTJwDVY4UHpXGzd", "UlGQ5WaiQHpVvJp5QrN7")


setPath(path)

console.log(path);



function computeDistance(a, b) {
	const [x1, y1] = a
	const [x2, y2] = b
	const dx = x2 - x1
	const dy = y2 - y1
	return Math.sqrt(dx * dx + dy * dy)
}