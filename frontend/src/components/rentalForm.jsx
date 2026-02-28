import React, { useEffect } from "react";
import Joi from "joi";
import useForm from "../hooks/useForm";
import useFetch from "../hooks/useFetch";
import useRentals from "../hooks/useRentals";
import queryString from "query-string";
import { getMovies } from "../services/movieService";

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
      const { data } = await getMovies();
      return data;
    },
    []
  );

  const movies = moviesData || [];

  const { createRental } = useRentals(false);

  useEffect(() => {
    const { movieId } = queryString.parse(location.search);
    if (movieId) {
      setData({ movieId });
    }
  }, [location.search, setData]);

  const doSubmit = async () => {
    try {
      await createRental(data.movieId);
      history.push("/movies");
    } catch (ex) {
      // Error is already handled in the hook
    }
  };


  return (
    <div className="col-md-6">
      <h2 className="mb-4">Rent Movie</h2>

      <form onSubmit={handleSubmit(doSubmit)}>
        {renderSelect("movieId", "Movie", movies, "_id", "title")}
        {renderButton("Confirm Rental")}
      </form>
    </div>
  );
};

export default RentalForm;
