import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getMyRentals,
  getRentalSummary,
  returnRental,
  saveRental,
} from '../services/rentalService';
import { toast } from 'react-toastify';

const useRentals = (autoFetch = true) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(false);

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getMyRentals();
      setRentals(data);
      return data;
    } catch (ex) {
      toast.error('Failed to load rentals.');
      console.error('Failed to load rentals:', ex);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchRentals();
    }
  }, [autoFetch, fetchRentals]);

  const createRental = useCallback(async (movieId, payment = {}) => {
    try {
      await saveRental({
        movieId,
        initialPayment: Number(payment.initialPayment),
        paymentStatus: payment.paymentStatus ?? 'SUCCESS',
        paymentMethod: payment.paymentMethod,
      });
      toast.success('Rental started');
      return true;
    } catch (ex) {
      toast.error(
        typeof ex.response?.data === 'string'
          ? ex.response.data
          : ex.response?.data?.message || 'Something went wrong'
      );
      throw ex;
    }
  }, []);

  const fetchReturnSummary = useCallback(async (rentalId) => {
    try {
      const { data } = await getRentalSummary(rentalId);
      return data;
    } catch (ex) {
      toast.error(
        typeof ex.response?.data === 'string'
          ? ex.response.data
          : 'Could not load return details.'
      );
      throw ex;
    }
  }, []);

  const submitReturn = useCallback(
    async (rentalId, body) => {
      try {
        setReturning(true);
        await returnRental(rentalId, body);
        toast.success('Movie returned. Thank you!');
        await fetchRentals();
        return true;
      } catch (ex) {
        toast.error(
          typeof ex.response?.data === 'string'
            ? ex.response.data
            : 'Return failed.'
        );
        throw ex;
      } finally {
        setReturning(false);
      }
    },
    [fetchRentals]
  );

  const activeRentals = useMemo(
    () => rentals.filter((r) => !r.dateReturned),
    [rentals]
  );

  const returnedRentals = useMemo(
    () => rentals.filter((r) => r.dateReturned),
    [rentals]
  );

  return {
    rentals,
    activeRentals,
    returnedRentals,
    loading,
    returning,
    fetchRentals,
    createRental,
    fetchReturnSummary,
    submitReturn,
  };
};

export default useRentals;
