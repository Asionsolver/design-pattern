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
