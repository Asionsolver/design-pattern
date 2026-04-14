// Generic Event Type
type EventData = { orderId: string; amount: number; items: string[] };

interface IObserver {
  name: string;
  handleEvent(data: EventData): void;
}

class EventBus {
  private static instance: EventBus;
  private observers: Map<string, IObserver[]> = new Map();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) EventBus.instance = new EventBus();
    return EventBus.instance;
  }

  subscribe(eventType: string, observer: IObserver) {
    if (!this.observers.has(eventType)) this.observers.set(eventType, []);
    this.observers.get(eventType)?.push(observer);
  }

  publish(eventType: string, data: EventData) {
    console.log(`\n--- Event: ${eventType} Triggered ---`);
    this.observers.get(eventType)?.forEach((obs) => {
      console.log(`Notifying Module: ${obs.name}`);
      obs.handleEvent(data);
    });
  }
}

// Concrete Modules
class InventoryModule implements IObserver {
  name = "Inventory";
  handleEvent(data: EventData) {
    console.log(`Updating stock for items: ${data.items.join(", ")}`);
  }
}

class PaymentModule implements IObserver {
  name = "Payment";
  handleEvent(data: EventData) {
    console.log(
      `Processing payment of $${data.amount} for Order: ${data.orderId}`,
    );
  }
}

class NotificationModule implements IObserver {
  name = "SMS/Email";
  handleEvent(data: EventData) {
    console.log(`Sending confirmation to customer for order ${data.orderId}`);
  }
}

// Execution
const bus = EventBus.getInstance();

const inventory = new InventoryModule();
const payment = new PaymentModule();
const notification = new NotificationModule();

// Subscribing to "ORDER_PLACED" event
bus.subscribe("ORDER_PLACED", inventory);
bus.subscribe("ORDER_PLACED", payment);
bus.subscribe("ORDER_PLACED", notification);

// Simulate Order Placement
bus.publish("ORDER_PLACED", {
  orderId: "ORD-99BT",
  amount: 1200,
  items: ["Laptop", "Mouse"],
});
