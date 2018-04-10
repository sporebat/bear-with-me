const fs = require('fs');
const {homedir} = require('os');
const {join,basename} = require('path');
const chokidar = require('chokidar');
const {promisify} = require('util');
const calculateBearing = require('./bearing');
const directory = join(homedir(), 'Saved Games', 'Frontier Developments', 'Elite Dangerous');
const fileName = 'Status.json';
const statusJSONPath = join(directory, fileName);

const FLAGS = {
    Docked: 1 << 0,
    Landed: 1 << 1,
    LandingGearDown: 1 << 2,
    ShieldsUp: 1 << 3,
    Supercruise: 1 << 4,
    FlightAssistOff: 1 << 5,
    HardpointsDeployed: 1 << 6,
    InWing: 1 << 7,
    LightsOn: 1 << 8,
    CargoScoopDeployed: 1 << 9,
    SilentRunning: 1 << 10,
    ScoopingFuel: 1 << 11,
    SrvHandbrake: 1 << 12,
    SrvTurret: 1 << 13,
    SrvUnderShip: 1 << 14,
    SrvDriveAssist: 1 << 15,
    FsdMassLocked: 1 << 16,
    FsdCharging: 1 << 17,
    FsdCooldown: 1 << 18,
    LowFuel: 1 << 19,
    OverHeating: 1 << 20,
    HasLatLong: 1 << 21,
    IsInDanger: 1 << 22,
    BeingInterdicted: 1 << 23,
    InMainShip: 1 << 24,
    InFighter: 1 << 25,
    InSRV: 1 << 26
};

const readFileProm = promisify(fs.readFile);
const speak = require('./speak');

let lastSpoken = null;

async function procStatusJson(filename, coords) {
    process.stdout.write(`\r${new Date().toISOString()}: `);
	if (filename !== statusJSONPath) {
        process.stdout.write(`NOSTAT ${basename(filename)}\n`);
		return;
	}
	let obj;
	try {
		obj = await readFileProm(filename, 'utf8');
	} catch (err) {
        process.stdout.write(`${err.message}\n`);
        return;
	}
	if (obj) {
		let json;
		try {
			json = JSON.parse(obj);
		} catch (err) {
            process.stdout.write(`${err.message}\n`);
            return;
		}
		if (!json) {
            process.stdout.write('FALSEY\n');
            return;
        }
        if (json.flags & FLAGS.HasLatLong === 0) {
            process.stdout.write('NOCRDS\n');
            return;
        }
        if (typeof json.Latitude !== 'number' || typeof json.Longitude !== 'number') {
            process.stdout.write('NONUMS\n');
            return;
        }
        process.stdout.write('LATLON\n');
        const { bearing, radialDistance } = calculateBearing(coords, [json.Latitude, json.Longitude]);
        console.log(
            new Date().toISOString(),
            json.Latitude.toFixed(0),
            json.Longitude.toFixed(0),
            '->',
            bearing.toFixed(0),
            radialDistance.toFixed(0));
        const message = `${radialDistance.toFixed(0)} at ${bearing.toFixed(0)}`;
        if (lastSpoken !== message) {
            lastSpoken = message;
            await speak(message);
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
    console.error('watching', directory);
    chokidar.watch(directory).on('change', f => procStatusJson(f, coords));
	procStatusJson(statusJSONPath, coords);
}

if (!module.parent) {
	main();
}
