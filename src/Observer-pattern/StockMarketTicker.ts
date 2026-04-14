interface StockObserver {
  update(price: number): void;
}

class Stock {
  private observers: StockObserver[] = [];
  private price: number = 0;

  subscribe(o: StockObserver) {
    this.observers.push(o);
  }

  setPrice(price: number) {
    this.price = price;
    this.observers.forEach((o) => o.update(this.price));
  }
}

class MobileApp implements StockObserver {
  update(price: number) {
    console.log(`Mobile alert! Stock price is now ${price}$`);
  }
}
class WebDashboard implements StockObserver {
  update(price: number) {
    console.log(`Web graph updating to ${price}$`);
  }
}

class EmailNotification implements StockObserver {
  update(price: number) {
    console.log(`Email sent: Stock price changed to ${price}$`);
  }
}

// Usage

const appleStock = new Stock();
appleStock.subscribe(new MobileApp());
appleStock.subscribe(new WebDashboard());
appleStock.subscribe(new EmailNotification());

appleStock.setPrice(150);
appleStock.setPrice(155);
appleStock.setPrice(160);
