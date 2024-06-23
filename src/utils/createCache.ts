/* eslint-disable @typescript-eslint/no-explicit-any */
const ONE_MINUTE_MS = 60 * 1000;

const createCache = (cacheExpirationDuration: number = ONE_MINUTE_MS * 10) => {
  const cache = new Map<string, any>();

  const setCacheData = (key: string, data: any) => {
    cache.set(key, { data, expireTime: Date.now() + cacheExpirationDuration });
    return data;
  };

  const getCacheData = (key: string) => {
    const cachedData = cache.get(key);
    if (cachedData && cachedData.expireTime > Date.now()) {
      return cachedData.data;
    }
    return null;
  };

  const isCachedDataValid = (key: string) => {
    const cachedData = cache.get(key);
    if (!cachedData) return false;

    return cachedData.expireTime > Date.now();
  };
  return {
    setCacheData,
    getCacheData,
    isCachedDataValid,
  };
};

export default createCache;
