import { useState, useEffect, useCallback, useMemo } from 'react';
import { getMyRentals, returnRental, saveRental } from '../services/rentalService';
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

  const createRental = useCallback(async (movieId) => {
    try {
      await saveRental({ movieId });
      toast.success('Movie rented successfully!');
      return true;
    } catch (ex) {
      toast.error(ex.response?.data || 'Something went wrong');
      throw ex;
    }
  }, []);

  const handleReturn = useCallback(async (rentalId, paymentMethod) => {
    try {
      setReturning(true);
      await returnRental(rentalId, paymentMethod);
      toast.success('Payment successful. Movie returned!');
      
      const { data } = await getMyRentals();
      setRentals(data);
      return true;
    } catch (ex) {
      toast.error(ex.response?.data || 'Payment failed.');
      throw ex;
    } finally {
      setReturning(false);
    }
  }, []);

  const calculateAmount = useCallback((rental) => {
    if (!rental) return 0;
    const days = Math.max(
      1,
      Math.ceil((new Date() - new Date(rental.dateOut)) / (1000 * 60 * 60 * 24))
    );
    return days * rental.movie.dailyRentalRate;
  }, []);

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
    handleReturn,
    calculateAmount,
  };
};

export default useRentals;
