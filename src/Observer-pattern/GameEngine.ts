type EventCallback = (data: any) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  }
}

const gameEvents = new EventBus();

// Subsystem 1: UI update (Health bar will update when player's HP decreases)
gameEvents.on("HP_CHANGED", (data) =>
  console.log(`[UI] Health bar updated to: ${data.hp}%`),
);

// Subsystem 2: Sound Engine (Plays heartbeat sound when HP is low)
gameEvents.on("HP_CHANGED", (data) => {
  if (data.hp < 20) console.log(`[Sound] Playing low_health_heartbeat.mp3`);
});

// Subsystem 3: AI Logic (Enemies become aggressive when HP is low)
gameEvents.on("HP_CHANGED", (data) => {
  if (data.hp < 20) console.log(`[AI] Enemies going into aggressive mode!`);
});

// Subsystem 4: Analytics
gameEvents.on("HP_CHANGED", (data) => {
  // Log player's death rate analysis to the database
});

// Game Logic - Will only emit the HP decrease event, other systems will react automatically!
gameEvents.emit("HP_CHANGED", { hp: 15 });
