const AsionStore = (function () {
  let itemsCount = 0;
  let godownItemsCount: { name: string; quantity: number }[] = [];

  return {
    addItems(name: string, quantity: number, itemsName: string): string {
      itemsCount += quantity;
      godownItemsCount.push({ name: itemsName, quantity });
      return `✅ ${name} added ${quantity} ${itemsName}. Total inventory is now ${itemsCount}.`;
    },
    count(): string {
      return `📦 Total items in inventory: ${itemsCount}`;
    },
    getGodownItems(): string {
      const itemsList = godownItemsCount
        .map((item) => `${item.quantity} ${item.name}`)
        .join(", ");
      return `🏬 Godown Inventory: ${itemsList}`;
    },

    sellItems(name: string, quantity: number, itemsName: string): string {
      if (quantity > itemsCount) {
        return `❌ Sorry ${name}, we only have ${itemsCount} items in stock.`;
      }
      itemsCount -= quantity;
      return `✅ ${name} sold ${quantity} ${itemsName}. Total inventory is now ${itemsCount}.`;
    },

    // Additional methods for updating and deleting items can be added here

    deleteItems(name: string, itemsName: string): string {
      const index = godownItemsCount.findIndex(
        (item) => item.name === itemsName,
      );
      if (index !== -1) {
        const removedItem = godownItemsCount.splice(index, 1)[0];
        if (removedItem) {
          // Extra caution
          itemsCount -= removedItem.quantity;
          return `🗑️ ${name} deleted ${removedItem.quantity} ${itemsName}. Total inventory is now ${itemsCount}.`;
        }
      }
      return `❌ Item ${itemsName} not found in inventory.`;
    },

    updateItems(name: string, itemsName: string, newQuantity: number): string {
      const item = godownItemsCount.find((item) => item.name === itemsName);
      if (item) {
        const quantityDifference = newQuantity - item.quantity;
        item.quantity = newQuantity;
        itemsCount += quantityDifference;
        return `🔄 ${name} updated ${itemsName} to ${newQuantity}. Total inventory is now ${itemsCount}.`;
      }
      return `❌ Item ${itemsName} not found in inventory.`;
    },
  };
})();

// Example usage:
/*
console.log(AsionStore.addItems("Alice", 50, "Rice"));
console.log(AsionStore.addItems("Bob", 30, "Wheat"));
console.log(AsionStore.count());
console.log(AsionStore.getGodownItems());
console.log(AsionStore.sellItems("Charlie", 20, "Rice"));
console.log(AsionStore.count());
console.log(AsionStore.sellItems("Dave", 70, "Wheat"));
console.log(AsionStore.count());

console.log(AsionStore.deleteItems("Eve", "Wheat"));
console.log(AsionStore.count());

console.log(AsionStore.updateItems("Frank", "Rice", 40));
console.log(AsionStore.count());
*/
// console.log("Direct godown: ", typeof AsionStore.godownItemsCount); // Property 'godownItemsCount' does not exist on type
// console.log("ItemsCount: ", typeof AsionStore.itemsCount); // Property 'itemsCount' does not exist on type

const AccountManager = (function () {
  type Account = { name: string; balance: number };
  type ActionType =
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "DEPOSIT"
    | "WITHDRAW"
    | "CHECK";

  let records: Account[] = [];
  let accessLogs: { name: string; action: ActionType; timestamp: Date }[] = [];

  // 🔒 PRIVATE ------------------------

  function logAccess(name: string, action: ActionType) {
    accessLogs.push({ name, action, timestamp: new Date() });
  }

  function findAccount(name: string): Account | undefined {
    return records.find((acc) => acc.name === name);
  }

  function formatAccounts(list: Account[]): string {
    if (list.length === 0) return "⚠️ No accounts found.";
    return list.map((acc) => `${acc.name}: $${acc.balance}`).join("\n");
  }

  // 🟢 PUBLIC ------------------------

  function createAccount(name: string, initialBalance: number): string {
    if (findAccount(name)) {
      return `❌ Account "${name}" already exists.`;
    }

    records.push({ name, balance: initialBalance });
    logAccess(name, "CREATE");

    return `✅ Account "${name}" created with $${initialBalance}.`;
  }

  function deposit(name: string, amount: number): string {
    const acc = findAccount(name);
    if (!acc) return `❌ Account "${name}" not found.`;

    acc.balance += amount;
    logAccess(name, "DEPOSIT");

    return `💰 ${name} deposited $${amount}. New balance: $${acc.balance}`;
  }

  function withdraw(name: string, amount: number): string {
    const acc = findAccount(name);
    if (!acc) return `❌ Account "${name}" not found.`;

    if (acc.balance < amount) {
      return `❌ Insufficient balance. Current: $${acc.balance}`;
    }

    acc.balance -= amount;
    logAccess(name, "WITHDRAW");

    return `💸 ${name} withdrew $${amount}. Remaining: $${acc.balance}`;
  }

  function getBalance(name: string): string {
    const acc = findAccount(name);
    if (!acc) return `❌ Account "${name}" not found.`;

    logAccess(name, "CHECK");
    return `💳 Balance of ${name}: $${acc.balance}`;
  }

  function deleteAccount(name: string): string {
    const index = records.findIndex((acc) => acc.name === name);
    if (index === -1) return `❌ Account "${name}" not found.`;

    records.splice(index, 1);
    logAccess(name, "DELETE");

    return `🗑️ Account "${name}" deleted.`;
  }

  function getSummary(): string {
    const totalAccounts = records.length;
    const totalBalance = records.reduce((sum, acc) => sum + acc.balance, 0);

    return `📊 Total Accounts: ${totalAccounts}\n💰 Total Balance: $${totalBalance}`;
  }

  // 🔍 Generic Filters (NO duplication)

  function filterByBalance(predicate: (balance: number) => boolean): string {
    return `🔍 Filtered Accounts:\n${formatAccounts(
      records.filter((acc) => predicate(acc.balance)),
    )}`;
  }

  function filterByName(predicate: (name: string) => boolean): string {
    return `🔍 Filtered Accounts:\n${formatAccounts(
      records.filter((acc) => predicate(acc.name)),
    )}`;
  }

  function sortAccounts(by: "name" | "balance"): string {
    const sorted = [...records].sort((a, b) =>
      by === "name" ? a.name.localeCompare(b.name) : b.balance - a.balance,
    );

    return `📊 Sorted Accounts:\n${formatAccounts(sorted)}`;
  }

  function getAccessLogs(): string {
    if (accessLogs.length === 0) return "📜 No logs available.";

    return accessLogs
      .map(
        (log) =>
          `${log.name} → ${log.action} at ${log.timestamp.toLocaleTimeString()}`,
      )
      .join("\n");
  }

  // ✅ ONLY expose safe API
  return {
    createAccount,
    deposit,
    withdraw,
    getBalance,
    deleteAccount,
    getSummary,
    filterByBalance,
    filterByName,
    sortAccounts,
    getAccessLogs,
  };
})();

// Example usage:
/*
AccountManager.createAccount("Ashis", 1000);
AccountManager.createAccount("Rahim", 500);

AccountManager.deposit("Ashis", 200);
AccountManager.withdraw("Rahim", 100);

console.log(AccountManager.getBalance("Ashis"));

console.log(AccountManager.filterByBalance((balance) => balance > 700));
console.log(AccountManager.filterByName((name) => name.startsWith("A")));
console.log(AccountManager.sortAccounts("balance"));
console.log(AccountManager.getSummary());
console.log(AccountManager.getAccessLogs());
console.log(AccountManager.withdraw("Rahim", 10000));
// console.log(AccountManager.logAccess()) // Property 'logAccess' does not exist on type
*/

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
