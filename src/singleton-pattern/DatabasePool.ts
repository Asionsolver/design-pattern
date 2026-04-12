class DatabasePool {
  private static instance: DatabasePool;
  private connectionStatus: boolean = false;

  private constructor() {
    // Private constructor, so that no one outside can create a new object by using new
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
      DatabasePool.instance.connect();
    }
    return DatabasePool.instance;
  }

  private connect() {
    console.log("Connecting to Database...");
    // Simulated connection logic
    this.connectionStatus = true;
  }

  public query(sql: string) {
    if (!this.connectionStatus) {
      throw new Error("No database connection!");
    }
    console.log(`Executing query: ${sql}`);
  }

  public disconnect() {
    this.connectionStatus = false;
    console.log("Database disconnected.");
  }
}

// Usage:
const db = DatabasePool.getInstance();
db.query("SELECT * FROM users");

const db1 = DatabasePool.getInstance();
db1.query("SELECT * FROM products");

const db2 = DatabasePool.getInstance();
db2.disconnect(); // Disconnected from db2

// Now let's try to use db1
try {
  db1.query("SELECT * FROM orders");
} catch (e) {
  console.log("Error caught!"); // This will be printed because db1 and db2 are the same instance!
}
