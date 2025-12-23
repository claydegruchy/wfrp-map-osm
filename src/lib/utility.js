export function mercatorToLngLat([x, y]) {
	const R = 6378137;
	const lng = (x / R) * (180 / Math.PI);
	const lat =
		(2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
	return [lng, lat];
}


export function webMercatorToBounds(extent) {
	const R = 6378137;
	const [xMin, yMin, xMax, yMax] = extent;

	const lonMin = (xMin / R) * (180 / Math.PI);
	const lonMax = (xMax / R) * (180 / Math.PI);
	const latMin = (Math.atan(Math.sinh(yMin / R))) * (180 / Math.PI);
	const latMax = (Math.atan(Math.sinh(yMax / R))) * (180 / Math.PI);

	return [lonMin, latMin, lonMax, latMax];
}

export function convertPoints(points) {
	return points.map(({ id, coordinates, name, credit, tags }) => ({
		lngLat: mercatorToLngLat(coordinates),
		name,
		credit,
		tags,
		id,
	}));
}
