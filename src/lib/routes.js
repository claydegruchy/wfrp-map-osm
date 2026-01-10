


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
import { isEditMode, isDev, localRoutesObjectNonStore, map, selectedPathIndex } from "./stores"


// console.log(routesRaw.filter(routes => {
// 	if (!locationsObject[routes.source_id]) {
// 		console.log(routes.source_id, "missing");
// 		return true
// 	}
// 	if (!locationsObject[routes.destination_id]) {
// 		console.log(routes.destination_id, "missing");
// 		return true
// 	}

// }));


export let routes = routesRaw.map(routes => ({
	...routes,
	length: computeDistance(locationsObject[routes.source_id].coordinates, locationsObject[routes.destination_id].coordinates)
}))
export let routesObject = Object.fromEntries(routes.map(route => [route.source_id + ":" + route.destination_id, route]))



export let routeSource = new VectorSource()

export const pathSources = [
	new VectorSource(),
	new VectorSource(),
	new VectorSource(),
]






export let pathSource = new VectorSource()

const routeStyleGen = (colour, lineDash, lineDashOffset) =>
	new Style({
		stroke: new Stroke({
			color: colour,
			width: 4,
			lineDash,
			lineDashOffset,
		})
	})


const localRouteStyleDisabled = (local) => new Style({
	stroke: new Stroke({
		width: 1,
		color: 'grey',
		lineDash: [2, 8]
	})
})


const mainPathStyle = (feature) => new Style({
	zIndex: 10,
	stroke: new Stroke({
		width: 4,
		color: 'red'
	})
})

const secondaryPathStyle = (feature) => new Style({
	zIndex: 100,
	stroke: new Stroke({
		width: 2,
		color: 'brown'
	})
})


export const routeTagMap = {
	"road": "black",
	"river": "RoyalBlue",
	"sea": "blue",
	"underway": "orange",
	"local": "yellow",
}




export const pathLayers =
	[
		new VectorLayer({
			source: pathSources[0],
			style: null
		}),
		new VectorLayer({
			source: pathSources[1],
			style: null
		}),
		new VectorLayer({
			source: pathSources[2],
			style: null
		}),

	]


export const routesLayer = new VectorLayer({
	source: routeSource,

	style: ((feature, zoom) => {
		let tags = feature.get('tags');
		let id = feature.getId()
		const local = localRoutesObjectNonStore[id]
		if (local && !localRoutesObjectNonStore[id]?.enabled) return localRouteStyleDisabled(local)


		let length = 20
		// tags.length > 1 && console.log(id);
		let styles = tags
			.filter(t => routeTagMap[t])
			.map((t, i, a) => {
				let on = length / a.length;
				let off = length - on;      // ensures total cycle = length
				return routeStyleGen(routeTagMap[t], [on, off], i * on);
			});

		return styles

	})

})

export const pathLayer = new VectorLayer({
	source: pathSource,
	style: mainPathStyle
})


export function toggleRoutesDisplay() {
	routesLayer.setVisible(!routesLayer.getVisible())
}


export function setRoutesDisplay(enabled) {
	routesLayer.setVisible(enabled)
}
setRoutesDisplay(false)


export function setRoutes(override) {
	routeSource.clear()
	if (override) routes = override

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
	console.log(routes)
	// setRoutesDisplay(true)
}




export function setPaths(index, selected, { pathNodes, pathRouteIds, pathRouteTags }) {
	console.log("setPaths", index, selected, pathRouteTags);

	pathSources[index].clear()

	let path = []
	for (const routeId of pathRouteIds) {
		path.push(routesObject[routeId])
	}


	const features = path.map(({ source_id, destination_id, ...rest }) => {
		let f = new Feature({
			geometry: new LineString([locationsObject[source_id].coordinates, locationsObject[destination_id].coordinates]),
			...rest
		})
		f.setId(index + source_id + destination_id)
		return f
	})
	pathSources[index].addFeatures(features)

	pathLayers[index].setStyle(selected ? mainPathStyle : secondaryPathStyle)

}


export function setPath({ pathRouteIds, id }) {
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
		f.setId(id + source_id + destination_id)
		return f
	})
	pathSource.addFeatures(features)
}
setRoutes()


export let zoomToEncompass = function ({ pathNodes }, padding = 100, duration = 1000) { }

export let addRoute = ({ source_id, destination_id, enabled = true, tags = ["road"], ...rest }, updateMap = true) => {
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
		...rest,
		source_id, destination_id, enabled, tags,
		length: computeDistance(locationsObject[source_id].coordinates, locationsObject[destination_id].coordinates)

	}

	const id = source_id + ":" + destination_id
	routesObject[id] = newRoute
	// console.log(newRoute);

	routes = Object.values(routesObject)
	updateMap && setRoutes()


	// routesObject = Object.fromEntries(routes.map(route => [route.source_id + ":" + route.destination_id, route]))


	return newRoute

}


function updatePathStyles(index) {

	pathLayers.forEach((layer, i) => {
		if (index == -1) return layer.setStyle(null)
		layer.setStyle(i == index ? mainPathStyle : secondaryPathStyle)
	})

}

map.subscribe(map => {
	if (!map) return

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

	selectedPathIndex.subscribe(updatePathStyles)

	pathLayers.forEach((layer, i) => {
		map.on("singleclick", (evt) => {
			map.forEachFeatureAtPixel(evt.pixel, (f) => {
				selectedPathIndex.set(i)
			}, {
				hitTolerance: 6,
				layerFilter: (clickedLayer) => clickedLayer == layer,
			});



		})
	})



})



export function _findPath(startId, endId, methods, speeds) {
	{
		console.log("findPath", startId, endId, methods, speeds);

		window.umami?.track("findPath", { start: locationsObject[startId]?.name, end: locationsObject[endId]?.name })
		const graph = {}
		const nameGraph = {}


		// build adjacency with weights
		for (const key in routesObject) {
			const { source_id, destination_id, enabled, tags, ...rest } = routesObject[key]
			if (!enabled) continue


			// compute weight (currently distance, can change later)
			for (const tag of tags) {
				if (!methods[tag] || !speeds[tag]) continue

				let weight = rest.length
				weight /= speeds[tag][methods[tag]]

				graph[source_id] ??= []
				graph[destination_id] ??= []

				graph[source_id].push({ node: destination_id, weight, routeId: key, method: tag })
				graph[destination_id].push({ node: source_id, weight, routeId: key, method: tag }) // undirected

				nameGraph[source_id + destination_id] = key
				nameGraph[destination_id + source_id] = key
			}
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
		console.log(pathNodes, pathRouteIds,);

		return { pathNodes, pathRouteIds }
	}

}


export function findPaths(startId, endId, methods, speeds, K_PATHS = 3, TRANSFER_PENALTY = 0.2) {
	const graph = {}

	// Build graph
	for (const key in routesObject) {
		const { source_id, destination_id, enabled, tags, ...rest } = routesObject[key]
		if (!enabled) continue

		for (const tag of tags) {
			if (!methods[tag] || !speeds[tag]) continue

			let weight = rest.length
			weight /= speeds[tag][methods[tag]]

			graph[source_id] ??= []
			graph[destination_id] ??= []

			graph[source_id].push({
				node: destination_id,
				weight,
				routeId: key,
				method: tag
			})
			graph[destination_id].push({
				node: source_id,
				weight,
				routeId: key,
				method: tag
			})
		}
	}

	// Dijkstra with transport-change penalty
	function dijkstra(bannedRouteIds = new Set(), startOverride = startId) {
		const dist = {}
		const prev = {}
		const queue = new Set()

		for (const n in graph) {
			dist[n] = {}
			prev[n] = {}
		}

		dist[startOverride][null] = 0
		queue.add(`${startOverride}|null`)

		while (queue.size) {
			let bestKey = null
			let bestVal = Infinity

			for (const k of queue) {
				const [n, m] = k.split("|")
				const method = m === "null" ? null : m
				if (dist[n][method] < bestVal) {
					bestVal = dist[n][method]
					bestKey = k
				}
			}

			queue.delete(bestKey)
			const [current, m] = bestKey.split("|")
			const currentMethod = m === "null" ? null : m

			if (current === endId) break

			for (const edge of graph[current]) {
				if (bannedRouteIds.has(edge.routeId)) continue

				const penalty =
					currentMethod && currentMethod !== edge.method
						? TRANSFER_PENALTY
						: 0

				const alt = dist[current][currentMethod] + edge.weight + penalty

				if (
					dist[edge.node][edge.method] === undefined ||
					alt < dist[edge.node][edge.method]
				) {
					dist[edge.node][edge.method] = alt
					prev[edge.node][edge.method] = {
						node: current,
						method: currentMethod,
						routeId: edge.routeId
					}
					queue.add(`${edge.node}|${edge.method}`)
				}
			}
		}

		let bestMethod = null
		let bestDist = Infinity
		for (const m in dist[endId]) {
			if (dist[endId][m] < bestDist) {
				bestDist = dist[endId][m]
				bestMethod = m === "null" ? null : m
			}
		}

		if (bestMethod === null) return null

		const pathNodes = []
		const pathRouteIds = []
		const pathRouteTags = []

		let node = endId
		let method = bestMethod

		while (node !== startOverride) {
			pathNodes.unshift(node)
			const p = prev[node][method]
			pathRouteIds.unshift(p.routeId)
			pathRouteTags.unshift(p.method)
			node = p.node
			method = p.method
		}

		pathNodes.unshift(startOverride)

		return { pathNodes, pathRouteIds, pathRouteTags, cost: bestDist }
	}

	// --- Yen-style TOP K paths ---
	const results = []
	const candidates = []

	const first = dijkstra()
	if (!first) return []

	results.push(first)

	for (let k = 1; k < K_PATHS; k++) {
		const prevPath = results[k - 1]

		for (let i = 0; i < prevPath.pathNodes.length - 1; i++) {
			const rootPathNodes = prevPath.pathNodes.slice(0, i + 1)
			const rootPathRouteIds = prevPath.pathRouteIds.slice(0, i)
			const rootPathTags = prevPath.pathRouteTags.slice(0, i)
			const spurNode = prevPath.pathNodes[i]

			// Ban **all edges after the spur node** in previous paths sharing the same root
			const banned = new Set()
			for (const p of results) {
				if (p.pathNodes.slice(0, i + 1).join() === rootPathNodes.join()) {
					for (let j = i; j < p.pathRouteIds.length; j++) banned.add(p.pathRouteIds[j])
				}
			}

			// Run Dijkstra from spur node
			const spurPath = dijkstra(banned, spurNode)
			if (!spurPath) continue

			// Combine root + spur
			const totalPathNodes = rootPathNodes.slice(0, -1).concat(spurPath.pathNodes)
			const totalPathRouteIds = rootPathRouteIds.concat(spurPath.pathRouteIds)
			const totalPathTags = rootPathTags.concat(spurPath.pathRouteTags)
			const totalCost =
				rootPathRouteIds.reduce((acc, rid, idx) => {
					const edge = graph[rootPathNodes[idx]].find(e => e.routeId === rid)
					return acc + (edge ? edge.weight : 0)
				}, 0) + spurPath.cost

			candidates.push({
				pathNodes: totalPathNodes,
				pathRouteIds: totalPathRouteIds,
				pathRouteTags: totalPathTags,
				cost: totalCost
			})
		}


		if (!candidates.length) break

		// pick lowest-cost candidate
		candidates.sort((a, b) => a.cost - b.cost)
		results.push(candidates.shift())
	}

	return results
}




// let re = findPath(routes, "ZzxEIjTJwDVY4UHpXGzd", "i5xZQabC5G69fLeA8Nm6")
// let path = findPath("ZzxEIjTJwDVY4UHpXGzd", "cL30w9UailtiheDMkqTR")






export function meterConv(m) {
	return Math.round(m * 0.0006213712 * 0.2355808286)
	1231

	// 320 (290 / 350) miles Road

}

export function distanceToTime(dis, speed) {
	return Math.round(meterConv(dis) / speed);
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
