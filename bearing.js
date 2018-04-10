function calculateBearing(destination, origin) {
	// Thanks EDBearing.
	var latStart = radians(origin[0])
	var lonStart = radians(origin[1])
	var latDest = radians(destination[0])
	var lonDest = radians(destination[1])
	var deltaLon = lonDest - lonStart;
	var deltaLat = Math.log(Math.tan(Math.PI / 4 + latDest / 2) / Math.tan(Math.PI / 4 + latStart / 2));
	var bearing = deg(Math.atan2(deltaLon, deltaLat));

	if (bearing < 0) {
		bearing = 360 + bearing;
	}
    var halfChordLengthSquared =
        Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
        Math.cos(latStart) * Math.cos(latDest) * Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const radialDistance = deg(2 * Math.atan2(Math.sqrt(halfChordLengthSquared), Math.sqrt(1 - halfChordLengthSquared)));
	return {
        bearing,
        radialDistance,
    };
}

function radians(deg) {
    return Math.PI * (deg / 180);
}

function deg(radians) {
    return radians * (180 / Math.PI);
}

module.exports = calculateBearing
