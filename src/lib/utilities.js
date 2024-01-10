// a function to convert openlayers coordinate system to long lat

import proj4 from 'proj4';
function transform(coord, source, destination) {
    return proj4(source, destination, coord);
}
// a function to convert long lat to openlayers coordinate system
export const convertToLongLat = (coord) => {
    return transform(coord, 'EPSG:3857', 'EPSG:4326');
}
// convert bounds to long lat, output is array of 4 numbers
export const convertBoundsToLongLat = (bounds) => {
    const topLeft = convertToLongLat([bounds[0], bounds[1]]);
    const bottomRight = convertToLongLat([bounds[2], bounds[3]]);
    return [topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]];
}
