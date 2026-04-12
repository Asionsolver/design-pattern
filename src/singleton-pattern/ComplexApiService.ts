interface ApiResponse<T> {
  data: T;
  status: number;
  fromCache: boolean;
}

// An interface for cache items (to keep time with data)
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiService {
  private static instance: ApiService;
  private cache = new Map<string, CacheItem<any>>(); // Data + Time saving
  private pendingRequests = new Map<string, Promise<any>>(); // Concurrency handling

  private readonly CACHE_TTL = 10000; // 10 seconds (Cache Expiration Time)
  private readonly MAX_RETRIES = 3; // Maximum 3 retries (Retry Mechanism)
  private baseURL: string = "https://api.myapp.com";

  private constructor() {
    console.log("--- ApiService Initialized ---");
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // 1. [Cache Expiration Check]
    if (this.cache.has(url)) {
      const cachedItem = this.cache.get(url)!;
      const isExpired = Date.now() - cachedItem.timestamp > this.CACHE_TTL;

      if (!isExpired) {
        console.log(`[Cache Hit] Returning valid cache for: ${endpoint}`);
        return { data: cachedItem.data, status: 200, fromCache: true };
      }

      console.log(
        `[Cache Expired] Data for ${endpoint} is old. Fetching new...`,
      );
      this.cache.delete(url); // It expired, so I deleted it.
    }

    // 2. [Concurrency Handling]
    // If a request for the same URL is already in progress, wait for it instead of making a new one
    if (this.pendingRequests.has(url)) {
      console.log(
        `[Concurrency] Already fetching ${endpoint}, waiting for result...`,
      );
      const data = await this.pendingRequests.get(url);
      return { data, status: 200, fromCache: false };
    }

    // ৩. [Execution with Retry Mechanism]
    const fetchWithRetry = async (attempt: number): Promise<T> => {
      try {
        console.log(`[Network] Attempt ${attempt} for: ${endpoint}`);

        // Simulated network call (with logic to fail sometimes for testing)
        if (Math.random() < 0.3) throw new Error("Network Timeout!");

        const data = { id: 1, name: "Sample Data" } as unknown as T;
        return data;
      } catch (error) {
        if (attempt < this.MAX_RETRIES) {
          console.warn(`[Retry] Attempt ${attempt} failed. Retrying...`);
          return fetchWithRetry(attempt + 1);
        }
        throw error;
      }
    };

    // Saving the request to pendingRequests before it starts
    const requestPromise = fetchWithRetry(1);
    this.pendingRequests.set(url, requestPromise);

    try {
      const data = await requestPromise;
      // 4. If successful, save to cache (with timestamp)
      this.cache.set(url, { data, timestamp: Date.now() });
      return { data, status: 200, fromCache: false };
    } finally {
      // Once the task is done, remove it from pendingRequests
      this.pendingRequests.delete(url);
    }
  }
}

async function complexTest() {
  const api = ApiService.getInstance();

  console.log("--- Test 1: Concurrency (একই সাথে ৩টি কল) ---");
  // I sent 3 calls at once.
  const [p1, p2, p3] = await Promise.all([
    api.fetchData("/profile"),
    api.fetchData("/profile"),
    api.fetchData("/profile"),
  ]);
  // You will see only 1 [Network] log and 2 [Concurrency] logs in the output.

  console.log("\n--- Test 2: Cache Expiration ---");
  console.log("Waiting for 10 seconds for the cache to expire...");
  await new Promise((resolve) => setTimeout(resolve, 11000)); // Wait for 11 seconds

  const res = await api.fetchData("/profile");
  // You will see [Cache Expired] in the output, as the cache has expired.
  console.log(res);
}

complexTest();
