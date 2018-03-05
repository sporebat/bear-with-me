function calculateBearing(coords) {
	// Thanks EDBearing.
	var latStart = coords[3] * Math.PI / 180;
	var lonStart = coords[2] * Math.PI / 180;
	var latDest = coords[0] * Math.PI / 180;
	var lonDest = coords[1] * Math.PI / 180;
	var deltaLon = lonDest - lonStart;
	var deltaLat = Math.log(Math.tan(Math.PI / 4 + latDest / 2) / Math.tan(Math.PI / 4 + latStart / 2));
	var initialBearing = (Math.atan2(deltaLon, deltaLat)) * (180 / Math.PI);

	if (initialBearing < 0) {
		initialBearing = 360 + initialBearing;
	}
	console.log(initialBearing)
	initialBearing = Math.round(initialBearing);
	console.log(initialBearing);

	if (isNaN(initialBearing)) {
		// initialBearing = NaN;
	}
	else {
		console.log(initialBearing);
	}
}

module.exports = calculateBearing
