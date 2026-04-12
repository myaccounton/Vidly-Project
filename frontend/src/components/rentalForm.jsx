import React, { useEffect, useMemo, useState } from "react";
import Joi from "joi";
import { toast } from "react-toastify";
import useForm from "../hooks/useForm";
import useFetch from "../hooks/useFetch";
import useRentals from "../hooks/useRentals";
import queryString from "query-string";
import { getMovies } from "../services/movieService";
import PaymentModal from "./paymentModal";

const PAYMENT_DELAY_MS = 800;

const RentalForm = ({ history, location }) => {
  const schema = {
    movieId: Joi.string().required().label("Movie"),
  };

  const validateForm = (data) => {
    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(data, options);
    if (!error) return {};

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const { data, renderSelect, renderButton, handleSubmit, setData } = useForm(
    {
      movieId: "",
    },
    validateForm
  );

  const { data: moviesData } = useFetch(
    async () => {
      return await getMovies();
    },
    []
  );

  const movies = Array.isArray(moviesData) ? moviesData : [];

  const { createRental } = useRentals(false);

  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);

  const selectedMovie = useMemo(
    () => movies.find((m) => m._id === data.movieId),
    [movies, data.movieId]
  );

  const dailyRate = selectedMovie ? Number(selectedMovie.dailyRentalRate) : 0;

  useEffect(() => {
    const { movieId } = queryString.parse(location.search);
    if (movieId) {
      setData({ movieId });
    }
  }, [location.search, setData]);

  const doSubmit = () => {
    setShowPayment(true);
  };

  const handleInitialPayment = async (paymentMethod) => {
    if (!data.movieId || !selectedMovie) return;

    setPaying(true);
    try {
      await new Promise((r) => setTimeout(r, PAYMENT_DELAY_MS));
      toast.success("Payment successful!");
      await createRental(data.movieId, {
        initialPayment: dailyRate,
        paymentStatus: "SUCCESS",
        paymentMethod,
      });
      setShowPayment(false);
      history.push("/movies");
    } catch (ex) {
      // toasts handled in hook / above
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="col-md-6">
      <h2 className="mb-4">Rent Movie</h2>

      <form onSubmit={handleSubmit(doSubmit)}>
        {renderSelect("movieId", "Movie", movies, "_id", "title")}
        {renderButton("Confirm Rental")}
      </form>

      {showPayment && selectedMovie && (
        <PaymentModal
          title="Pay to start rental"
          movieTitle={selectedMovie.title}
          dailyRate={dailyRate}
          subtitle="Initial charge covers your first day."
          amount={dailyRate}
          onPay={handleInitialPayment}
          onClose={() => !paying && setShowPayment(false)}
          disabled={paying}
        />
      )}
    </div>
  );
};

export default RentalForm;
