import { useState, useEffect, useCallback } from "react";

export const useEventData = (
  initialSearchTerm = "",
  enableInfiniteScroll = true
) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isFetching, setIsFetching] = useState(true);
  const [orderToggle, setOrderToggle] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  const fetchData = useCallback(
    async (newOffset, newSearchTerm = searchTerm, order = orderToggle) => {
      setIsFetching(true);
      setError(null);
      try {
        let url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=${limit}&offset=${newOffset}`;
        if (newSearchTerm) {
          url += `&where=(search(title, "${encodeURIComponent(
            newSearchTerm
          )}") OR search(qfap_tags, "${encodeURIComponent(newSearchTerm)}"))`;
        }
        const sortOrder = order ? "DESC" : "ASC";
        url += `&order_by=date_start ${sortOrder}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataFetch = await response.json();
        const results = dataFetch.results || [];

        setHasMore(results.length === limit);

        setData((prev) => {
          if (newOffset === 0) {
            return results;
          }

          const newIds = new Set(prev.map((item) => item.id));
          const filteredResults = results.filter(
            (item) => !newIds.has(item.id)
          );
          return [...prev, ...filteredResults];
        });
      } catch (err) {
        console.error("Erreur fetch:", err);
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    },
    [limit, orderToggle]
  );

  const handleSearch = useCallback(
    (newSearchTerm) => {
      setSearchTerm(newSearchTerm);
      setOffset(0);
      setData([]);
      setHasMore(true);
      fetchData(0, newSearchTerm);
    },
    [fetchData]
  );

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      fetchData(newOffset, searchTerm);
    }
  }, [isFetching, offset, limit, fetchData, hasMore]);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      !isFetching &&
      hasMore
    ) {
      loadMore();
    }
  }, [isFetching, loadMore]);

  const resetData = useCallback(() => {
    setData([]);
    setOffset(0);
    setError(null);
    setSearchTerm("");
  }, []);

  useEffect(() => {
    fetchData(0, initialSearchTerm);
  }, []);

  useEffect(() => {
    setOffset(0);
    setData([]);
    setHasMore(true);
    fetchData(0, searchTerm, orderToggle);
  }, [orderToggle, fetchData]);

  useEffect(() => {
    if (enableInfiniteScroll) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, enableInfiniteScroll]);

  return {
    data,
    error,
    isFetching,
    searchTerm,
    setSearchTerm,
    handleSearch,
    loadMore,
    resetData,
    orderToggle,
    setOrderToggle,
    hasMore,
  };
};
