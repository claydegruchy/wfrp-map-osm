import { writable } from "svelte/store";



const urlParams = new URLSearchParams(window.location.search);
export const isDev = urlParams.get("dev") === "true";
export const isEditMode = urlParams.get("edit") && urlParams.get("edit") != "";
export const editId = isEditMode && urlParams.get("edit")



export const map = writable();
export const selectedLocations = writable([])
export const diagnosticFeatures = writable([]);

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
		console.log(raw);

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
console.log(loadLocalStorage("addLocationTags"));
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


export function clearAll() {
	localStorage.clear()
	window.location.reload();
}


function importFeatures(file) {

}