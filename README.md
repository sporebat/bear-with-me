# bear-with-me

## Usage:
```bash
node index.js <destlat> <destlong>
```
## TODO

* Listen for `FSDJump`
* Decode `StarSystem`

* Listen for `ApproachBody` and `LeaveBody`
* Decode `StarSystem` and `Body`

* Listen for `Liftoff` and `Touchdown`
* Decode `Longitude` and `Latitude`

* Listen for `Location` (startup, resurrection)
* Decode `StarSystem` and `Body`
* Decode `Longitude` and `Latitude`

* Listen for `Scan` (basic or detailed)
* Decode `Bodyname`, `BodyID`, `Radius`, `SurfaceGravity`, `Landable`, `Materials`, `Parents`

* Listen for `LaunchSRV`

* Listen for `Status`
* Decode `Flags`, `Latitude`, and `Longitude`
* Consider bits 1 (landed), 8 (lights on), 21 (has lat long), 24 (in main ship), and 26 (in SRV) of `Flags`

* Calculate actual distance if radius is available

* Calculate whether the destination is visible
