import { writable } from "svelte/store";

export const map = writable();
export const selectedLocations = writable([])
export const diagnosticFeatures = writable([]);

export const localRoutes = writable([])
export const localLocations = writable([])

const urlParams = new URLSearchParams(window.location.search);
export const isDev = urlParams.get("dev") === "true";
export const isAddMode = urlParams.get("add") && urlParams.get("add") != "";
export const addId = isAddMode && urlParams.get("add")


function saveLocalStorage(key, obj) {
	console.log("saveLocalStorage", key);
	localStorage.setItem(key, JSON.stringify(obj))

}
function loadLocalStorage(key) {
	console.log("loadLocalStorage", key);
	return JSON.parse(localStorage.getItem(key))
}


localRoutes.subscribe(routes => {
	saveLocalStorage("routes", Object.fromEntries(routes.map(route => [route.source_id + ":" + route.destination_id, route])))
})

localLocations.subscribe(locations => {
	saveLocalStorage("locations", Object.fromEntries(locations.map(location => [location.id, location])))
})


export const addLocationTags = writable("")
addLocationTags.subscribe(
	lut => {
		saveLocalStorage("addLocationTags", lut)
	}
)