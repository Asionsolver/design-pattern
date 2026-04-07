export interface PaymentResponse {
  success: boolean;
  amount: number;
  transactionId: string;
}

export const TAX_RATE = 0.15;

export function processPayment(amount: number): PaymentResponse {
  console.log(`Processing payment of $${amount}...`);
  return {
    success: true,
    amount: amount + amount * TAX_RATE,
    transactionId: "TXN-12345",
  };
}

export function refund(transactionId: string): boolean {
  console.log(`Refunding transaction: ${transactionId}`);
  return true;
}
