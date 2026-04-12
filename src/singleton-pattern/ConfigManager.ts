class ConfigManager {
  private static instance: ConfigManager;
  private settings: { [key: string]: string } = {};

  private constructor() {
    // Simulating loading settings from a file or environment variables
    this.settings = {
      apiEndpoint: "https://api.example.com",
      timeout: "5000",
    };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getSetting(key: string): string {
    const value = this.settings[key];
    if (!value) {
      throw new Error(`Setting with key "${key}" not found!`);
    }
    return value;
  }
}

// Usage:
const config = ConfigManager.getInstance();
console.log(config.getSetting("apiEndpoint"));

// Repeatedly doing new creates new "copies" in memory, which is unnecessary. Singleton ensures that there will be only 1 copy in the entire system, and everyone will share that one copy. This is the real advantage of saving memory and using a central store.
