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

// console.log("Direct godown: ", typeof AsionStore.godownItemsCount); // Property 'godownItemsCount' does not exist on type
// console.log("ItemsCount: ", typeof AsionStore.itemsCount); // Property 'itemsCount' does not exist on type
