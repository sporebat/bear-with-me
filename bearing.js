function calculateBearing(destination, origin) {
	// Thanks EDBearing.
	var latStart = origin[0] * Math.PI / 180;
	var lonStart = origin[1] * Math.PI / 180;
	var latDest = destination[0] * Math.PI / 180;
	var lonDest = destination[1] * Math.PI / 180;
	var deltaLon = lonDest - lonStart;
	var deltaLat = Math.log(Math.tan(Math.PI / 4 + latDest / 2) / Math.tan(Math.PI / 4 + latStart / 2));
	var initialBearing = (Math.atan2(deltaLon, deltaLat)) * (180 / Math.PI);

	if (initialBearing < 0) {
		initialBearing = 360 + initialBearing;
	}
	initialBearing = Math.round(initialBearing);
	return initialBearing;
}

module.exports = calculateBearing
