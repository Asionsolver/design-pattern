// Defining interfaces (for type safety)
interface ApiResponse<T> {
  data: T;
  status: number;
  fromCache: boolean;
}

class ApiService {
  private static instance: ApiService;
  private cache = new Map<string, any>(); // To store data in memory for caching
  private authToken: string | null = null;
  private baseURL: string = "https://api.myapp.com";

  // 1. Private constructor to prevent direct instantiation
  private constructor() {
    console.log("--- ApiService Initialized (Network Layer Ready) ---");
  }

  // 2. Singleton Instance Getter
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // 3. Authentication Token Setter
  public setToken(token: string) {
    this.authToken = token;
    console.log("Auth Token set for all future requests.");
  }

  // 4. Smart Data Fetching Method (Complex Logic)
  public async fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // 1. First check if data exists in cache
    if (this.cache.has(url)) {
      console.log(`[Cache Hit] Returning cached data for: ${endpoint}`);
      return {
        data: this.cache.get(url),
        status: 200,
        fromCache: true,
      };
    }

    // 2. If not in cache, simulate a network call
    console.log(`[Network Call] Fetching data from server for: ${endpoint}...`);

    // Adding token to the request (simulation)
    const headers = this.authToken
      ? { Authorization: `Bearer ${this.authToken}` }
      : {};

    // We are returning dummy data (in reality, this would be fetch() or axios)
    const dummyData = { id: 1, name: "Sample Data" } as unknown as T;

    // 3. Save data in cache
    this.cache.set(url, dummyData);

    return {
      data: dummyData,
      status: 200,
      fromCache: false,
    };
  }

  // 5. Cache Clearing Method (Optional)

  public clearCache() {
    this.cache.clear();
    console.log("Cache cleared.");
  }
}

// --- Field of use (Professional Use Case) ---

async function runExample() {
  const api1 = ApiService.getInstance();
  const api2 = ApiService.getInstance();

  // User logs in (let's say on the home page)
  api1.setToken("SECRET_JWT_TOKEN_123");

  // First time fetching profile data
  console.log("--- Request 1 ---");
  console.time("Request 1");
  const res1 = await api1.fetchData("/user/profile");
  console.log("Did the first time come from Cache?", res1.fromCache); // Output: false
  console.log(res1);
  // Another file or component calls the profile data again
  console.log("\n--- Request 2 ---");
  console.time("Request 2");
  const res2 = await api2.fetchData("/user/profile"); // api2 is being used but it will behave like api1
  console.log("Did the second time come from Cache?", res2.fromCache); // Output: true
  console.log(res2);
  console.log("\nAre both instances same?", api1 === api2); // true
  console.log("Is Request 2 from cache?", res2.fromCache); // true
}

runExample();

async function testCache() {
  const api = ApiService.getInstance();
  interface UserData {
    name: string;
  }

  // 1. First time data acquisition
  const res1 = await api.fetchData<UserData>("/user/profile");
  console.log(res1.data.name); // Output: "Sample Data"

  // 2. We simulate tampering with the cached data (for testing purposes)
  // @ts-ignore (accessing private property for testing)

  api.cache.set("https://api.myapp.com/user/profile", {
    name: "I am from Cache!",
  });

  // 3. We fetch the data again
  const res2 = await api.fetchData<UserData>("/user/profile");

  console.log(res2.data.name);
  // Output: "I am from Cache!"
  // This means the data came from the cache, not the server.
  // The cached data was modified earlier.
}

testCache();
