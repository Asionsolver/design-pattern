class Logger {
  private static instance: Logger;
  private logCount: number = 0;
  public readonly id: number;
  // 1. The constructor must be made private so that new Logger() cannot be called from outside.
  private constructor() {
    console.log("--- New Instance Created! ---");
    this.id = Math.random();
  }

  // 2. A static method to get the instance of the Logger class. This method checks if an instance already exists; if not, it creates one.
  public static getInstance(): Logger {
    // 1. Checks: Has the object been created before? (Is it null?)
    if (!Logger.instance) {
      // 2. If it has not been created (first time), then only call 'new'
      Logger.instance = new Logger();
    }
    // 3. If it has already been created, then return the existing instance
    return Logger.instance;
  }
  public addLog() {
    this.logCount++;
  }

  public getCount() {
    return this.logCount;
  }
  public log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

// Usage:
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
const logger3 = Logger.getInstance();
console.log("ID 1:", logger1.id);
console.log("ID 2:", logger2.id);
console.log("ID 3:", logger3.id);
logger1.addLog(); // Incremented by 1 with logger1
logger1.addLog(); // Incremented by 1 with logger1 (Total: 2)
console.log(logger1.getCount()); // Output: 2
// console.log(logger1 === logger2); // Output: true (Same object)
// console.log(logger2 === logger3); // Output: true (Same object)

/**
1. Due to private constructor, no one outside can create new.
2. Due to static instance, the object created is saved in memory.
3. Due to if (!instance) check, instead of creating a new object every time, the previous one is returned.
*/
