import { ApiError } from "#/api/customError";
import { useCacheContext } from "#/contexts/CacheContext";
import { FetchStatus } from "#/types/common";
import { useState, useEffect, useRef } from "react";

interface FetchState<T> {
  data?: T;
  status: FetchStatus;
  error: Error | null;
  cacheKey: string;
}

export default function useSuspenseFetch<T>(fetchCallback: () => Promise<T>, cacheKey: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    status: "initial",
    error: null,
    cacheKey,
  });
  const currentPromise = useRef<Promise<void> | null>(null);
  const { setCacheData, getCacheData, isCachedDataValid } = useCacheContext();
  useEffect(() => {
    const loadDataFromEndpoint = async () => {
      try {
        const response = await fetchCallback();
        setCacheData(cacheKey, response);
        setState((prev) => ({ ...prev, data: response, cacheKey, status: "fulfilled" }));
      } catch (error) {
        if (error instanceof Error) {
          setState((prev) => ({ ...prev, status: "rejected", error: new ApiError(error.message) }));
        } else {
          setState((prev) => ({ ...prev, status: "rejected", error: new Error("Unknown error occurred") }));
        }
      }
    };

    if (state.status === "initial" || !isCachedDataValid(cacheKey)) {
      if (isCachedDataValid(cacheKey)) {
        setState((prev) => ({ ...prev, data: getCacheData(cacheKey), cacheKey, status: "fulfilled" }));
      } else {
        setState((prev) => ({ ...prev, status: "pending" }));
        currentPromise.current = loadDataFromEndpoint();
      }
    }
  }, [fetchCallback, state.status, cacheKey, isCachedDataValid, getCacheData, setCacheData]);

  if (state.status === "pending" && currentPromise.current) {
    throw currentPromise.current;
  }

  if (state.status === "rejected" && state.error) {
    throw state.error;
  }
  return state;
}
