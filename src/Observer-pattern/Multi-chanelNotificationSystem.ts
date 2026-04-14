interface NotificationObserver {
  notify(productName: string): void;
}

class Product {
  private observers: NotificationObserver[] = [];
  subscribe(o: NotificationObserver) {
    this.observers.push(o);
  }
  inStock(productName: string) {
    this.observers.forEach((o) => o.notify(productName));
  }
}

class EmailNotifier implements NotificationObserver {
  notify(p: string) {
    console.log(`Sending Email: ${p} is in stock!`);
  }
}
class SMSNotifier implements NotificationObserver {
  notify(p: string) {
    console.log(`Sending SMS: ${p} is in stock!`);
  }
}
class PushNotifier implements NotificationObserver {
  notify(p: string) {
    console.log(`Sending Push Notification: ${p} is in stock!`);
  }
}

const iphone = new Product();
iphone.subscribe(new EmailNotifier());
iphone.subscribe(new SMSNotifier());
iphone.subscribe(new PushNotifier());

iphone.inStock("iPhone 15");
