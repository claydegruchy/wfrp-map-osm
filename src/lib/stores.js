import { writable } from "svelte/store";

export const map = writable();
export const selectedLocations = writable([])
export const diagnosticFeatures = writable([]);


const urlParams = new URLSearchParams(window.location.search);
export const isDev = urlParams.get("dev") === "true";
