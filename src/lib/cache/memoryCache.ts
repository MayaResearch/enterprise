/**
 * Simple in-memory cache for server-side caching
 * Good for single-instance deployments. For multi-instance, use Redis.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number; // Time to live in milliseconds

  constructor(defaultTTL: number = Infinity) { // No expiration by default (we control all updates)
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    
    // Cleanup expired entries every minute (only if TTL is set)
    if (defaultTTL !== Infinity) {
      setInterval(() => this.cleanup(), 60 * 1000);
    }
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiresAt });
  }

  /**
   * Delete a specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Delete all keys matching a pattern
   * Example: deletePattern('user:123:*') deletes all keys starting with 'user:123:'
   */
  deletePattern(pattern: string): number {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export a singleton instance
export const memoryCache = new MemoryCache();

// Helper function to generate cache keys
export const cacheKeys = {
  userApiKeys: (userId: string) => `user:${userId}:api-keys`,
  apiKey: (userId: string, keyId: string) => `user:${userId}:api-key:${keyId}`,
  userData: (userId: string) => `user:${userId}:data`,
  allUsers: () => `admin:all-users`,
};

