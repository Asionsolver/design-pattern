interface Observer {
  update(news: string): void;
}

class NewsAgency {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  notify(news: string) {
    this.observers.forEach((obs) => obs.update(news));
  }
}

class Subscriber implements Observer {
  constructor(private name: string) {}
  update(news: string) {
    console.log(`${this.name} received news: ${news}`);
  }
}

// Usage
const agency = new NewsAgency();
const user1 = new Subscriber("Rahim");
const user2 = new Subscriber("Karim");

agency.subscribe(user1);
agency.subscribe(user2);
agency.notify("TypeScript 5.0 is out!");
