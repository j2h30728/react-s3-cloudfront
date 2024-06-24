import { useState, useEffect, useRef, useCallback } from "react";
import { ApiError } from "#/api/customError";
import { useCacheContext } from "#/contexts/CacheContext";
import { FetchStatus } from "#/types/common";

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

  const loadDataFromEndpoint = useCallback(
    async (offset: number) => {
      const cacheKey = `${cacheKeyPrefix}-${offset}`;
      try {
        const response = await fetchCallback(offset);
        setState((prev) => ({ ...prev, data: [...prev.data, response], status: "fulfilled" }));
        currentOffset.current = offset + 1;
        setCacheData(cacheKey, response);
      } catch (error) {
        setState({
          data: [],
          status: "rejected",
          error: error instanceof Error ? new ApiError(error.message) : new Error("Unknown error occurred"),
        });
      } finally {
        setIsFetching(false);
      }
    },
    [cacheKeyPrefix, fetchCallback, setCacheData]
  );

  const loadMoreData = useCallback(async () => {
    if (state.status === "pending" || isFetching) {
      return;
    }

    setIsFetching(true);
    const offset = currentOffset.current;
    const cacheKey = `${cacheKeyPrefix}-${offset}`;

    if (isCachedDataValid(cacheKey)) {
      setState((prev) => ({
        ...prev,
        data: [...prev.data, getCacheData(cacheKey)],
        status: "fulfilled",
      }));
      currentOffset.current = offset + 1;
      setIsFetching(false);
      return;
    }

    currentPromise.current = loadDataFromEndpoint(offset);
  }, [cacheKeyPrefix, getCacheData, isCachedDataValid, isFetching, loadDataFromEndpoint, state.status]);

  useEffect(() => {
    if (state.status === "initial") {
      const cacheKey = `${cacheKeyPrefix}-0`;
      if (isCachedDataValid(cacheKey)) {
        setState({ data: getCacheData(cacheKey), status: "fulfilled", error: null });
      } else {
        setState((prev) => ({ ...prev, status: "pending" }));
        currentPromise.current = loadDataFromEndpoint(0);
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
