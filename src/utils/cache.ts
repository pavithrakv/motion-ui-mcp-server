/**
 * Simple in-memory cache for API responses
 */
import { logDebug } from './logger.js';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL: number = 300000; // 5 minutes

  set(key: string, data: any, ttl?: number): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };
    
    this.cache.set(key, entry);
    logDebug(`Cache SET: ${key}`);
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logDebug(`Cache MISS: ${key}`);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      logDebug(`Cache EXPIRED: ${key}`);
      return null;
    }

    logDebug(`Cache HIT: ${key}`);
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logDebug(`Cache DELETE: ${key}`);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    logDebug('Cache CLEARED');
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      logDebug(`Cache cleanup: removed ${cleaned} expired entries`);
    }
  }
}

export const cache = new Cache();

// Set up periodic cleanup
setInterval(() => {
  cache.cleanup();
}, 60000); // Clean up every minute