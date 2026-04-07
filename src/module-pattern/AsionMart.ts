// Dependency Injection Example

// 1. Type definitions (Interfaces) for each module
interface InventoryActions {
  unitPrice: (totalPrice: number, quantity: number) => number;
  totalPrice: (unitPrice: number, quantity: number) => number;
  generateInvoice: (
    itemName: string,
    qty: number,
    price: number,
    disc: number,
    tax: number,
  ) => string;
  updateStock: (itemName: string, qty: number) => void;
  checkAvailability: (itemName: string, qty: number) => boolean;
  deductStock: (itemName: string, qty: number) => void;
}

interface AnalyticsActions {
  recordTransaction: (amount: number) => void;
  getDailyReport: () => string;
}

interface SalesActions {
  processSale: (
    itemName: string,
    qty: number,
    price: number,
    disc: number,
    tax: number,
  ) => string;
}

interface CustomerActions {
  createCustomer: (name: string, email: string) => string;
  addPoints: (email: string, amount: number) => void;
  getPoints: (email: string) => number;
}

interface OrderActions {
  placeOrder: (
    customer: string,
    item: string,
    qty: number,
    price: number,
    disc: number,
    tax: number,
  ) => string;
}

// 2. Set the main object type
const AsionMart: {
  Inventory?: InventoryActions;
  Analytics?: AnalyticsActions;
  Sales?: SalesActions;
  Customer?: CustomerActions;
  Order?: OrderActions;
  CustomerOrderBilling?: any;
} = {};

// 3. Inventory Module
AsionMart.Inventory = (function (): InventoryActions {
  const stockDatabase: Record<string, number> = {
    "MacBook Pro": 10,
    iPhone: 5,
  };

  return {
    unitPrice: (total, qty) => total / qty,
    totalPrice: (price, qty) => price * qty,
    updateStock: (item, qty) => {
      stockDatabase[item] = (stockDatabase[item] || 0) + qty;
    },
    checkAvailability: (item, qty) => (stockDatabase[item] || 0) >= qty,
    deductStock: (item, qty) => {
      if (stockDatabase[item]) stockDatabase[item] -= qty;
    },
    generateInvoice: (itemName, quantity, unitPrice, discountRate, taxRate) => {
      const total = unitPrice * quantity;
      const discount = total * (discountRate / 100);
      const tax = (total - discount) * (taxRate / 100);
      const finalPrice = total - discount + tax;

      // Send data to Analytics if the sale is successful (it's best to avoid direct internal calls, but it's included here for example)
      return `
      --- INVOICE ---
      Item: ${itemName} x ${quantity}
      Final Price: $${finalPrice.toFixed(2)}
      ----------------`;
    },
  };
})();

// 4. Analytics Module
AsionMart.Analytics = (function (): AnalyticsActions {
  let dailyTotal = 0;
  return {
    recordTransaction: (amount: number) => {
      dailyTotal += amount;
    },
    getDailyReport: () => `📊 Today's total sales: $${dailyTotal.toFixed(2)}`,
  };
})();

// 5. Sales Module
AsionMart.Sales = (function (
  Inv: InventoryActions,
  Ana: AnalyticsActions,
): SalesActions {
  return {
    processSale: (itemName, qty, price, disc, tax) => {
      // Check stock availability
      if (!Inv.checkAvailability(itemName, qty)) {
        return `❌ STOCK OUT: Sorry, we don't have ${qty} units of ${itemName} in stock.`;
      }

      // Reduce stock
      Inv.deductStock(itemName, qty);

      // Record data in Analytics (it's best to avoid direct internal calls, but it's included here for example)
      const amount = price * qty;
      Ana.recordTransaction(amount);

      // Return the invoice
      return Inv.generateInvoice(itemName, qty, price, disc, tax);
    },
  };
})(AsionMart.Inventory!, AsionMart.Analytics!);

// 6. Customer Module
AsionMart.Customer = (function (): CustomerActions {
  const db: Record<string, { name: string; points: number }> = {};
  return {
    createCustomer: (name, email) => {
      db[email] = { name, points: 0 };
      return `👤 Customer: ${name} Created.`;
    },
    addPoints: (email, amount) => {
      if (db[email]) db[email].points += amount;
    },
    getPoints: (email) => db[email]?.points || 0,
  };
})();

// 7. Order Module
AsionMart.Order = (function (Sales: SalesActions): OrderActions {
  return {
    placeOrder: (customer, item, qty, price, disc, tax) => {
      const result = Sales.processSale(item, qty, price, disc, tax);
      if (result.startsWith("❌")) return result; // Error if sale fails
      return `📦 Order for ${customer}:\n${result}`;
    },
  };
})(AsionMart.Sales!);

// 8. Orchestrator
AsionMart.CustomerOrderBilling = (function (
  Cust: CustomerActions,
  Ord: OrderActions,
) {
  return {
    createCustomerPlaceOrderAndCalculateBill: (
      name: string,
      email: string,
      item: string,
      qty: number,
      price: number,
      disc: number,
      tax: number,
    ) => {
      const cInfo = Cust.createCustomer(name, email);
      const oInfo = Ord.placeOrder(name, item, qty, price, disc, tax);

      // If the sale is successful, give the customer points
      if (!oInfo.startsWith("❌")) {
        Cust.addPoints(email, 10);
      }

      return `${cInfo}\n${oInfo}`;
    },
  };
})(AsionMart.Customer!, AsionMart.Order!);

// --- Usage and Testing ---

// Test 1: Successful order (10 in stock, buying 1)
console.log("TEST 1: Regular Sale");
console.log(
  AsionMart.CustomerOrderBilling.createCustomerPlaceOrderAndCalculateBill(
    "Sabbir Ahmed",
    "sabbir@email.com",
    "MacBook Pro",
    1,
    2500,
    10,
    5,
  ),
);

// Test 2: Stock Out Scenario (5 units of iPhone in stock, trying to buy 10)
console.log("\nTEST 2: Stock Out Scenario");
console.log(
  AsionMart.CustomerOrderBilling.createCustomerPlaceOrderAndCalculateBill(
    "Karim Box",
    "karim@email.com",
    "iPhone",
    10,
    1000,
    0,
    5,
  ),
);

// Test 3: Analytics Report
console.log("\n" + AsionMart.Analytics!.getDailyReport());

console.log("AsionMart Modules", Object.keys(AsionMart));
console.log("Inventory API", Object.keys(AsionMart.Inventory));
console.log("Sales API", Object.keys(AsionMart.Sales));
console.log("Customer API", Object.keys(AsionMart.Customer));
console.log("Order API", Object.keys(AsionMart.Order));
console.log(
  "CustomerOrderBilling API",
  Object.keys(AsionMart.CustomerOrderBilling),
);
console.log(
  "Direct access to stockDatabase:",
  (AsionMart.Inventory as any).stockDatabase, // Property 'stockDatabase' does not exist on type 'InventoryActions'
);
