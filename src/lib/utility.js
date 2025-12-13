function mercatorToLngLat([x, y]) {
	const R = 6378137;
	const lng = (x / R) * (180 / Math.PI);
	const lat =
		(2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI);
	return [lng, lat];
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
