// Map polyfill to prevent "Map is not a constructor" errors
// This ensures Map is available in all environments

export function ensureMapConstructor() {
  // Check if Map is available and working properly
  if (typeof Map === 'undefined') {
    console.error('Map constructor not available, creating polyfill');
    // Simple Map polyfill for older environments
    (global as any).Map = class MapPolyfill<K, V> {
      private keys: K[] = [];
      private values: V[] = [];

      constructor() {}

      has(key: K): boolean {
        return this.keys.includes(key);
      }

      get(key: K): V | undefined {
        const index = this.keys.indexOf(key);
        return index !== -1 ? this.values[index] : undefined;
      }

      set(key: K, value: V): this {
        const index = this.keys.indexOf(key);
        if (index !== -1) {
          this.values[index] = value;
        } else {
          this.keys.push(key);
          this.values.push(value);
        }
        return this;
      }

      delete(key: K): boolean {
        const index = this.keys.indexOf(key);
        if (index !== -1) {
          this.keys.splice(index, 1);
          this.values.splice(index, 1);
          return true;
        }
        return false;
      }

      clear(): void {
        this.keys = [];
        this.values = [];
      }

      get size(): number {
        return this.keys.length;
      }

      keys(): IterableIterator<K> {
        return this.keys[Symbol.iterator]();
      }

      values(): IterableIterator<V> {
        return this.values[Symbol.iterator]();
      }

      entries(): IterableIterator<[K, V]> {
        const entries: [K, V][] = [];
        for (let i = 0; i < this.keys.length; i++) {
          entries.push([this.keys[i], this.values[i]]);
        }
        return entries[Symbol.iterator]();
      }

      [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
      }
    };
  } else {
    // Test if Map constructor works properly
    try {
      new Map();
      console.log('✅ Map constructor verified working');
    } catch (error) {
      console.error('Map constructor test failed:', error);
      // Force reload if Map is broken
      window.location.reload();
    }
  }
}

// Alternative implementation using plain objects instead of Map
export class SafeProfileCache {
  private cache: { [key: string]: any } = {};
  private keys: string[] = [];
  private maxSize: number;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  has(key: string): boolean {
    return key in this.cache;
  }

  get(key: string): any {
    return this.cache[key];
  }

  set(key: string, value: any): void {
    if (!this.has(key)) {
      // Add new key
      if (this.keys.length >= this.maxSize) {
        // Remove oldest entry
        const oldestKey = this.keys.shift();
        if (oldestKey) {
          delete this.cache[oldestKey];
        }
      }
      this.keys.push(key);
    }
    this.cache[key] = value;
  }

  delete(key: string): boolean {
    if (this.has(key)) {
      delete this.cache[key];
      const index = this.keys.indexOf(key);
      if (index > -1) {
        this.keys.splice(index, 1);
      }
      return true;
    }
    return false;
  }

  clear(): void {
    this.cache = {};
    this.keys = [];
  }

  get size(): number {
    return this.keys.length;
  }
}