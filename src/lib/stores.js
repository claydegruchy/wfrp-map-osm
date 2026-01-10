import { writable } from "svelte/store";



const urlParams = new URLSearchParams(window.location.search);
export const isDev = urlParams.get("dev") === "true";
export const isEditMode = urlParams.get("edit") && urlParams.get("edit") != "";
export const editId = isEditMode && urlParams.get("edit")
export const isOpMode = urlParams.get("opmode") && urlParams.get("opmode") != "";
export const isHardReset = urlParams.get("reset") && urlParams.get("reset") != "";

if (isHardReset) {
	localStorage.clear()
	const url = new URL(window.location.href);
	url.searchParams.delete("reset")
	window.location.href = url.toString();

}



export const isMobile =
	'ontouchstart' in window ||
	navigator.maxTouchPoints > 0 ||
	/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)



export const map = writable();
export const selectedLocations = writable([])
export const diagnosticFeatures = writable([]);

export const selectedPathIndex = writable(0)

export const pathFinderOrigin = writable()
export const pathFinderDestination = writable()



export const speeds = {
	road: {
		// road
		walk: 3.5,
		cart: 1.75,
		ride: 7,
	},
	river: {
		// river
		skiff: 1,
		barge: 2,
		warship: 4,
	},
	sea: {
		// sea
		sailship: 4,
		steamship: 6,
	},
	underway: {
		// underway
		walk: 3.5,

	}
};

export const roadMode = writable(Object.keys(speeds.road)[0])
export const riverMode = writable(Object.keys(speeds.river)[0])
export const seaMode = writable(Object.keys(speeds.sea)[0])
export const underwayMode = writable(Object.keys(speeds.underway)[0])

export const speedMethodMap = {
	road: roadMode,
	river: riverMode,
	sea: seaMode,
	underway: underwayMode,
}


const r = loadLocalStorage("routes")
export const localRoutes = writable(r ? Object.values(r) : [])
const l = loadLocalStorage("locations")
export const localLocations = writable(l ? Object.values(l) : [])


function saveLocalStorage(key, obj) {
	console.log("saveLocalStorage", key);
	localStorage.setItem(key, JSON.stringify(obj))

}
function loadLocalStorage(key) {
	console.log("loadLocalStorage", key);

	try {
		const raw = localStorage.getItem(key)
		if (raw === null) return null

		return JSON.parse(raw)
	} catch {
		return null
	}
}


export let localRoutesObjectNonStore = {}
localRoutes.subscribe(routes => {
	localRoutesObjectNonStore = Object.fromEntries(routes.map(route => [route.source_id + ":" + route.destination_id, route]))
	saveLocalStorage("routes", localRoutesObjectNonStore)
})
export let localLocationsObjectNonStore = {}
localLocations.subscribe(locations => {
	localLocationsObjectNonStore = Object.fromEntries(locations.map(location => [location.id, location]))
	saveLocalStorage("locations", localLocationsObjectNonStore)
})


export const addLocationTags = writable(loadLocalStorage("addLocationTags"))
addLocationTags.subscribe(
	lut => {
		saveLocalStorage("addLocationTags", lut)
	}
)


export function clearLocalFeatures() {
	localStorage.removeItem("routes")
	localStorage.removeItem("locations")
	window.location.reload();

}



