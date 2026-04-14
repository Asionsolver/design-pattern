interface Customer {
  update(productName: string): void;
}

class AppleStore {
  private customers: Customer[] = [];
  private inStock: boolean = false;

  addCustomer(customer: Customer) {
    this.customers.push(customer);
  }

  setStock(status: boolean) {
    this.inStock = status;
    if (this.inStock) {
      this.notifyCustomers();
    }
  }

  private notifyCustomers() {
    this.customers.forEach((c) => c.update("iPhone 15 Pro"));
  }
}

class EmailAlert implements Customer {
  constructor(private email: string) {}
  update(product: string) {
    console.log(`Sending email to ${this.email}: ${product} is back in stock!`);
  }
}

class SMSAlert implements Customer {
  constructor(private phoneNumber: string) {}
  update(product: string) {
    console.log(
      `Sending SMS to ${this.phoneNumber}: ${product} is back in stock!`,
    );
  }
}

class AppNotification implements Customer {
  constructor(private username: string) {}
  update(product: string) {
    console.log(
      `Sending app notification to ${this.username}: ${product} is back in stock!`,
    );
  }
}

class SocialMediaAlert implements Customer {
  constructor(private handle: string) {}
  update(product: string) {
    console.log(
      `Posting on social media for ${this.handle}: ${product} is back in stock!`,
    );
  }
}

// Usage

const store = new AppleStore();
store.addCustomer(new EmailAlert("rahim@gmail.com"));
store.addCustomer(new SMSAlert("01711111111"));
store.addCustomer(new AppNotification("rahim"));
store.addCustomer(new SocialMediaAlert("@rahim"));

store.setStock(true);
