const cacheMap = new Map<string, Promise<unknown>>();

export const cache = <T>(key: string, query: () => Promise<T>) => {
  if (!cacheMap.has(key)) {
    cacheMap.set(key, query());
  }
  return cacheMap.get(key) as Promise<T>;
};
