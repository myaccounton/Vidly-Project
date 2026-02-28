import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        
        if (isMountedRef.current) {
          setData(result);
        }
      } catch (ex) {
        if (isMountedRef.current) {
          setError(ex);
          console.error('Fetch error:', ex);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
      return result;
    } catch (ex) {
      setError(ex);
      console.error('Refetch error:', ex);
      throw ex;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  return { data, loading, error, refetch };
};

export default useFetch;
