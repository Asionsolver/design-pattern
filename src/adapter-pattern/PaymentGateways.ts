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

// Client Code
const processors: PaymentProcessor[] = [
  new PayPalAdapter(new PayPal()),
  new StripeAdapter(new Stripe()),
];

processors.forEach((p) => p.processPayment(100));
