import * as PaymentAPI from "./payment-processor";

// 1. Access properties of Namespace Object
const paymentAmount = 100;
const result: PaymentAPI.PaymentResponse =
  PaymentAPI.processPayment(paymentAmount);

console.log(`Total with Tax: ${result.amount}`);
console.log(`Transaction Status: ${result.success}`);

// 2. TypeScript will provide excellent intellisense here
// If you PaymentAPI. Write dot, but all functions and interfaces will show.
PaymentAPI.processPayment(200);

// 3. Another function call through the namespace object
PaymentAPI.refund(result.transactionId);
