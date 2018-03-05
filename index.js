const fs = require('fs');
const {homedir} = require('os');
const {join} = require('path');
const chokidar = require('chokidar');

const calculateBearing = require('./bearing');
const directory = join(homedir(), 'Saved Games', 'Frontier Developments', 'Elite Dangerous');
const fileName = 'Status.json';
const statusJSONPath = join(directory, fileName);

const focusToLocal = {
	0: 'No Focus',
	1: 'InternalPanel',
	2: 'ExternalPanel',
	3: 'CommsPanel',
	4: 'RolePanel',
	5: 'StationServices',
	6: 'GalaxyMap',
	7: 'SystemMap'
};

const flagToLocal = {
	FlagsDocked: 1 << 0,
	FlagsLanded: 1 << 1,
	FlagsLandingGearDown: 1 << 2,
	FlagsShieldsUp: 1 << 3,
	FlagsSupercruise: 1 << 4,
	FlagsFlightAssistOff: 1 << 5,
	FlagsHardpointsDeployed: 1 << 6,
	FlagsInWing: 1 << 7,
	FlagsLightsOn: 1 << 8,
	FlagsCargoScoopDeployed: 1 << 9,
	FlagsSilentRunning: 1 << 10,
	FlagsScoopingFuel: 1 << 11,
	FlagsSrvHandbrake: 1 << 12,
	FlagsSrvTurret: 1 << 13,
	FlagsSrvUnderShip: 1 << 14,
	FlagsSrvDriveAssist: 1 << 15,
	FlagsFsdMassLocked: 1 << 16,
	FlagsFsdCharging: 1 << 17,
	FlagsFsdCooldown: 1 << 18,
	FlagsLowFuel: 1 << 19,
	FlagsOverHeating: 1 << 20,
	FlagsHasLatLong: 1 << 21,
	FlagsIsInDanger: 1 << 22,
	FlagsBeingInterdicted: 1 << 23,
	FlagsInMainShip: 1 << 24,
	FlagsInFighter: 1 << 25,
	FlagsInSRV: 1 << 26
};

const promisify = func => (...args) =>
	new Promise((resolve, reject) =>
		func(...args, (err, result) => (err ? reject(err) : resolve(result)))
	);

const readFileProm = promisify(fs.readFile);
const speak = promisify(require('./speak'));

async function procStatusJson(filename, coords) {
	if (filename !== statusJSONPath) {
		return;
	}
	let obj;
	try {
		obj = await readFileProm(filename, 'utf8');
	} catch (err) {
		console.error(err);
	}
	if (obj) {
		let json;
		try {
			json = JSON.parse(obj);
		} catch (err) {
			console.error(err);
		}
		if (!json) {
			return;
		}
		let flags = [];
		for (const i in flagToLocal) {
			if (flagToLocal[i] & json.Flags) {
				flags.push(i);
			}
			if (flags.indexOf('FlagsHasLatLong') >= 0 && json.Latitude && json.Longitude) {
				const bearing = calculateBearing(coords, [json.Latitude, json.Longitude]);
				await speak(bearing);
			}
		}
	}
}

function main() {
	let coords = [];

	if (!isNaN(parseFloat(process.argv[2]))) {
		coords.push(parseFloat(process.argv[2]));
	}
	
	if (!isNaN(parseFloat(process.argv[3]))) {
		coords.push(parseFloat(process.argv[3]));
	}

	if (coords.length !== 2) {
		console.log(`Please provide destination latitude and destination longitude (in that order!)`);
		process.exit(1);
	}
	
	const message = `Guiding you towards lat ${Math.floor(coords[0])} lon ${Math.floor(coords[1])}.`;
	console.log(message);
	speak(message).catch(err => console.error(`Mute on this platform: ${err.message}`));
	chokidar.watch(directory).on('change', () => procStatusJson(coords));
	procStatusJson(statusJSONPath, coords);
}

if (!module.parent) {
	main();
}