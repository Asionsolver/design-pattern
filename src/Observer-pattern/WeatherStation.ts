interface Observer {
  update(temperature: number): void;
}

class WeatherSubject {
  private observers: Observer[] = []; // List containing all customer names
  addObserver(o: Observer) {
    this.observers.push(o); // When a new device arrives, it is added to the list.
  }

  setTemperature(temp: number) {
    // When the temperature changes, loop through the list and notify all observers
    this.observers.forEach((o) => o.update(temp));
  }
}

class PhoneDisplay implements Observer {
  update(temp: number) {
    console.log(`Phone updated: ${temp}°C`); // When the information is received, the phone performs its task
  }
}

class WindowDisplay implements Observer {
  update(temp: number) {
    console.log(`Window updated: ${temp}°C`); // When the information is received, the window performs its task
  }
}

// Usage
const station = new WeatherSubject();
station.addObserver(new PhoneDisplay());
station.addObserver(new WindowDisplay());
station.setTemperature(30); // Output: Phone updated: 30°C , Window updated: 30°C
station.setTemperature(25); // Output: Phone updated: 25°C , Window updated: 25°C
