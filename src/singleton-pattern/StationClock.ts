// object literal singleton pattern
const StationClock = {
  _hours: 12,
  _minutes: 0,
  _seconds: 0,

  tick() {
    this._seconds++;
    if (this._seconds === 60) {
      this._seconds = 0;
      this._minutes++;
    }
    if (this._minutes === 60) {
      this._minutes = 0;
      this._hours++;
    }
    if (this._hours === 13) {
      this._hours = 1;
    }
  },

  displayTime() {
    const hours = this._hours.toString().padStart(2, "0");
    const minutes = this._minutes.toString().padStart(2, "0");
    const seconds = this._seconds.toString().padStart(2, "0");
    console.log(`${hours}:${minutes}:${seconds}`);
  },
};

/*
console.log("Asion Station Clock:");
StationClock.displayTime(); // 12:00:00
StationClock.tick();
StationClock.tick();
console.log("Asion Station clock after two ticks:");
StationClock.displayTime();

const RajshahiStationClock = StationClock;
console.log("Rajshahi Station Clock:");
RajshahiStationClock.displayTime(); // 12:00:02
RajshahiStationClock.tick();
console.log("Rajshahi Station clock after one tick:");
RajshahiStationClock.displayTime(); // 12:00:03

console.log("Asion Station clock after Rajshahi Station clock ticked:");
StationClock.displayTime(); // 12:00:03

const DhakaStationClock = StationClock;
console.log("Dhaka Station Clock:");
DhakaStationClock.displayTime(); // 12:00:03
DhakaStationClock.tick();
console.log("Dhaka Station clock after one tick:");
DhakaStationClock.displayTime(); // 12:00:04

console.log("Asion Station clock after Dhaka Station clock ticked:");
StationClock.displayTime(); // 12:00:04

console.log(
  "Is Same Instance: ",
  StationClock === RajshahiStationClock &&
    RajshahiStationClock === DhakaStationClock,
);
*/

// immediately invoked function expression (IIFE) or module based singleton pattern
const StationBell = (function () {
  let ringCount = 0;

  const instance = {
    ring() {
      ringCount++;
      console.log(`Station bell rang ${ringCount} times.`);
    },

    totalRings() {
      return ringCount;
    },
  };

  return instance;
})();

// Example usage
/*
console.log("Ringing the station bell:");
StationBell.ring(); // Station bell rang 1 times.
StationBell.ring(); // Station bell rang 2 times.

console.log("Total rings:", StationBell.totalRings()); // Total rings: 2
*/

// class ClockMechanism {
//   private static instance: ClockMechanism;

//   private hours: number;
//   private minutes: number;
//   private seconds: number;

//   private constructor() {
//     this.hours = 12;
//     this.minutes = 0;
//     this.seconds = 0;
//   }

//   public static getInstance(): ClockMechanism {
//     if (!ClockMechanism.instance) {
//       ClockMechanism.instance = new ClockMechanism();
//     }
//     return ClockMechanism.instance;
//   }

//   public tick() {
//     this.seconds++;
//     if (this.seconds === 60) {
//       this.seconds = 0;
//       this.minutes++;
//     }
//     if (this.minutes === 60) {
//       this.minutes = 0;
//       this.hours++;
//     }
//     if (this.hours === 13) {
//       this.hours = 1;
//     }
//   }

//   public displayTime() {
//     const hours = this.hours.toString().padStart(2, "0");
//     const minutes = this.minutes.toString().padStart(2, "0");
//     const seconds = this.seconds.toString().padStart(2, "0");
//     console.log(`${hours}:${minutes}:${seconds}`);
//   }
// }

// Example usage
/*
const stationClock1 = ClockMechanism.getInstance();
const stationClock2 = ClockMechanism.getInstance();

console.log("Station Clock 1:");
stationClock1.displayTime(); // 12:00:00

console.log("Station Clock 2:");
stationClock2.displayTime(); // 12:00:00

console.log("Ticking Station Clock 1:");
stationClock1.tick();
stationClock1.tick();

console.log("Station Clock 1 after ticking:");
stationClock1.displayTime(); // 12:00:02

console.log("Station Clock 2 after Station Clock 1 ticked:");
stationClock2.displayTime(); // 12:00:02

console.log(
  "Is Same Instance: ",
  stationClock1 === stationClock2,
);
*/

// lazy initialization singleton pattern
class ClockMechanism {
  // 1. Static properties must be declared inside the class.
  private static _instance: ClockMechanism | null = null;

  // 2. Properties must be defined before the constructor
  public gears: number;
  public wounds: boolean;

  // 3. The constructor must be private to prevent direct instantiation (Singleton pattern)
  private constructor() {
    this.gears = 42;
    this.wounds = false;
    console.log("Clock Mechanism Initialized");
  }

  // 4. This method will check if an instance exists, and create it if not
  static getInstance(): ClockMechanism {
    if (!ClockMechanism._instance) {
      ClockMechanism._instance = new ClockMechanism();
    }
    return ClockMechanism._instance;
  }

  wind() {
    this.wounds = true;
    console.log("Clock wound up.");
  }

  status() {
    console.log(`Gears: ${this.gears}, Wounds: ${this.wounds ? "Yes" : "No"}`);
  }
}

// Now this is how you use it:

/*
const mech1 = ClockMechanism.getInstance();
const mech2 = ClockMechanism.getInstance();
// const mech3 = new ClockMechanism(); // Error: Constructor of class 'ClockMechanism' is private and only accessible within the class declaration.

console.log("Clock Mechanism 1 Status:");
mech1.status();

console.log("Winding Clock Mechanism 1...");
mech1.wind();

console.log("Clock Mechanism 2 Status (Should be wound too):");
mech2.status();

console.log("Is Same Instance: ", mech1 === mech2); // true
*/

// module pattern based singleton
// const StationAnnouncement = function () {
//   const config = {
//     platform: 8,
//     tracks: 4,
//     junctions: "Rajshahi Junction",
//   };

//   return Object.freeze(config); // Freezing the config object to prevent modifications
// };

// Example usage
/*
const announcement1 = StationAnnouncement();

console.log("Platform:", announcement1.platform); // Platform: 8
// announcement1.platform = 10; // This will not change the platform due to Object.freeze. Cannot assign to 'platform' because it is a read-only property.
console.log("Platform: ", announcement1.platform);
*/

const StationAnnouncement = (function () {
  // 1. Private variable that will only exist in memory once (Singleton Instance)
  let instance: {
    makeAnnouncement: (message: string) => void;
    updatePlatform: (newPlatform: number) => void;
    platform: number;
  } | null = null;

  function createInstance() {
    // Private data
    const config = {
      platform: 8,
      tracks: 4,
      junctions: "Rajshahi Junction",
    };

    // Method 1
    function makeAnnouncement(message: string) {
      console.log(`Announcement from Platform ${config.platform}: ${message}`);
    }

    // Method 2
    function updatePlatform(newPlatform: number) {
      config.platform = newPlatform;
      console.log(`Platform updated to ${config.platform}`);
    }

    // 2. Object as a return value with methods and properties
    return Object.freeze({
      makeAnnouncement,
      updatePlatform,
      get platform() {
        return config.platform;
      }, // Getter as a property
    });
  }

  return {
    // 3. External method to check if an instance exists
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// Example usage:
const announcement1 = StationAnnouncement.getInstance();
const announcement2 = StationAnnouncement.getInstance();

console.log("Platform:", announcement1.platform); // 8

// Call Method 1
announcement1.makeAnnouncement("The intercity train is arriving.");

// Call Method 2
announcement1.updatePlatform(10);

// Check the effect of Method 2
announcement2.makeAnnouncement("Next train on the new platform.");

console.log("Is Same Instance: ", announcement1 === announcement2); // true
