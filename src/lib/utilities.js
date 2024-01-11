import { getContext } from "svelte";
// place files you want to import through the `$lib` alias in this folder.
export const getMapInstance = () => {
    const { getMapInstance } = getContext("mapSharedState");
    return getMapInstance();
}

export const debounce = (func, wait = 300) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }
}

export const featureAtPixel = (pixel, mapInstance) => mapInstance.forEachFeatureAtPixel(
    pixel,
    feature => feature ? feature : null,
);



// debounced version of featureAtPixel
export const featureAtPixelDebounced = debounce(featureAtPixel, 300);
