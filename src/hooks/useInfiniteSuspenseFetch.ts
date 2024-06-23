import { ApiError } from "#/api/customError";
import { useCacheContext } from "#/contexts/CacheContext";
import { FetchStatus } from "#/types/common";
import { useState, useEffect, useRef, useCallback } from "react";

interface InfiniteFetchState<T> {
  data: T[];
  status: FetchStatus;
  error: Error | null;
}

export default function useInfiniteSuspenseFetch<T>(
  fetchCallback: (offset: number) => Promise<T>,
  cacheKeyPrefix: string
) {
  const [state, setState] = useState<InfiniteFetchState<T>>({
    data: [],
    status: "initial",
    error: null,
  });
  const currentOffset = useRef<number>(0);
  const currentPromise = useRef<Promise<void> | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { setCacheData, getCacheData, isCachedDataValid } = useCacheContext();

  const loadDataFromEndpoint = useCallback(async () => {
    const offset = currentOffset.current;
    const cacheKey = `${cacheKeyPrefix}-${offset}`;
    try {
      const response = await fetchCallback(offset);
      setCacheData(cacheKey, response);
      setState((prev) => ({ ...prev, data: [...prev.data, response], cacheKey, status: "fulfilled" }));
      currentOffset.current += 1;
    } catch (error) {
      if (error instanceof Error) {
        setState((prev) => ({ ...prev, status: "rejected", error: new ApiError(error.message) }));
      } else {
        setState((prev) => ({ ...prev, status: "rejected", error: new Error("Unknown error occurred") }));
      }
    } finally {
      setIsFetching(false);
    }
  }, [cacheKeyPrefix, fetchCallback, setCacheData]);

  const loadMoreData = useCallback(async () => {
    const page = currentOffset.current;
    const cacheKey = `${cacheKeyPrefix}-${page}`;
    setIsFetching(true);
    if (state.status === "pending") {
      return;
    }

    if (isCachedDataValid(cacheKey)) {
      setState((prev) => ({
        ...prev,
        data: [...prev.data, getCacheData(cacheKey)],
        status: "fulfilled",
      }));
      currentOffset.current += 1;
      return;
    }
    currentPromise.current = loadDataFromEndpoint();
  }, [cacheKeyPrefix, getCacheData, isCachedDataValid, loadDataFromEndpoint, state.status]);

  useEffect(() => {
    if (state.status === "initial") {
      const cacheKey = `${cacheKeyPrefix}-0`;
      if (isCachedDataValid(cacheKey)) {
        setState((prev) => ({ ...prev, data: getCacheData(cacheKey), cacheKey, status: "fulfilled" }));
      } else {
        setState((prev) => ({ ...prev, status: "pending" }));
        currentPromise.current = loadDataFromEndpoint();
      }
    }
  }, [cacheKeyPrefix, getCacheData, isCachedDataValid, loadDataFromEndpoint, state.status]);

  if (state.status === "pending" && currentPromise.current) {
    throw currentPromise.current;
  }

  if (state.status === "rejected" && state.error) {
    throw state.error;
  }

  return { ...state, loadMoreData, isFetching };
}
