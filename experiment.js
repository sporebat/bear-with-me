const BEGAN = Symbol();
const ENDED = Symbol();
const PERIOD = 60000; // ms

class Bucket {
    constructor(began, ended) {
        this[BEGAN] = began;
        this[ENDED] = ended || (began + 1);
    }

    get began() {
        return this[BEGAN];
    }

    get ended() {
        return this[ENDED];
    }

    get duration() {
        return this.ended - this.began;
    }

    incr(key, count) {
        this[key] = (this[key] || 0) + (count || 1);
    }

    toString() {
        return [
            `in last ${this.duration}:`,
            ... Object.keys(this).sort().map(
                k => `${k}: ${this[k]}`
            ),
        ].join('\n');
    }
}

class RollingWindow {
    constructor() {
        this.window = 60; // periods
        this.began = 0; // periods since epoch
        this.buckets = [];
    }

    rollup() {
        if (!this.buckets.length) {
            return new Bucket(this.now());
        } else {
            const first = this.buckets[0];
            const acc = new Bucket(
                this.buckets[0].began,
                this.buckets[this.buckets.length - 1].ended
            );
            for (let bucket of this.buckets) {
                for (let key in bucket) {
                    acc.incr(key, bucket[key]);
                }
            }
            return acc;
        }
    }

    incr(key, count) {
        const now = this.now();
        this.began = this.began || now;
        this.roll();
        let bucket = this.getbucket(now);
        if (!bucket) {
            bucket = new Bucket(now);
            this.buckets.push(bucket);
        }
        bucket.incr(key, count);
    }

    roll() {
        const now = this.now();
        this.buckets = this.buckets.filter(b => b.began > now - this.window);
    }

    getbucket(began) {
        return this.buckets.filter(b => b.began === began)[0];
    }

    now() {
        return Math.floor(Date.now() / PERIOD);
    }
}

const edlw = require('ed-logwatcher');
const watcher = new edlw.LogWatcher(edlw.DEFAULT_SAVE_DIR);
watcher.on('start', dpath => {
    console.error(`Watching: ${dpath}`);
});
watcher.on('error', err => {
    // watcher.stop();
    console.error(err.stack || err);
    console.error('keeping going...');
    // throw new Error(err.stack || err);
});
const DUMP = {
    ApproachBody: true,
    ApproachSettlement: true,
    Bounty: true,
    FSDJump: true,
    LaunchSRV: true,
    LeaveBody: true,
    Liftoff: true,
    Location: true,
    MaterialCollected: true,
    Scan: true,
    Status: false,
    Touchdown: true,
};
const materials = new RollingWindow();
const bounties = new RollingWindow();
const HANDLERS = {
    MaterialCollected(event) {
        materials.incr(event.Name, event.Count);
        console.log(materials.rollup().toString());
    },
    Bounty(event) {
        for (let reward of event.Rewards) {
            bounties.incr(reward.Faction, reward.Reward);
        }
        console.log(bounties.rollup().toString());
    }
};
const NOOP = event => { /* do nothing */};

watcher.on('data', obs => {
    obs.forEach(ob => {
        const {timestamp, event} = ob;
        if (!(timestamp && event)) {
            console.log('\n what', ob);
        }
        console.log('\n' + timestamp, event);
        if (!DUMP[event]) {
            return;
        }
        delete ob.timestamp;
        delete ob.event;
        Object.keys(ob).sort().forEach(k => {
            console.log('\t' + k, ob[k]);
        });
        (HANDLERS[event] || NOOP)(ob);
    });
});
watcher.start();
