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
