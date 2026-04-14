// Target Interface
interface PaymentProcessor {
  processPayment(amount: number): void;
}

// Adaptee 1: PayPal
class PayPal {
  makePayment(amount: number) {
    console.log(`Paid ${amount} using PayPal.`);
  }
}

// Adaptee 2: Stripe
class Stripe {
  charge(amount: number) {
    console.log(`Charged ${amount} using Stripe.`);
  }
}
class Bkash {
  sendMoney(amount: number) {
    console.log(`Sent ${amount} using Bkash.`);
  }
}
// Adapter for PayPal
class PayPalAdapter implements PaymentProcessor {
  constructor(private paypal: PayPal) {}
  processPayment(amount: number) {
    this.paypal.makePayment(amount);
  }
}

// Adapter for Stripe
class StripeAdapter implements PaymentProcessor {
  constructor(private stripe: Stripe) {}
  processPayment(amount: number) {
    this.stripe.charge(amount);
  }
}

class BkashAdapter implements PaymentProcessor {
  constructor(private bkash: Bkash) {}

  processPayment(amount: number): void {
    this.bkash.sendMoney(amount);
  }
}

// Client Code
const processors: PaymentProcessor[] = [
  new PayPalAdapter(new PayPal()),
  new StripeAdapter(new Stripe()),
  new BkashAdapter(new Bkash()),
];

processors.forEach((p) => p.processPayment(100));
