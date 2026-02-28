import React, { useEffect, useMemo, useCallback } from "react";
import Joi from "joi";
import useForm from "../hooks/useForm";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { Link } from "react-router-dom";
import FormSkeleton from "./common/formSkeleton";

const MovieForm = ({ match, history }) => {
  const { user } = useAuth();
  const isAdmin = user && user.isAdmin;

  const schema = useMemo(() => ({
    _id: Joi.string().allow(""),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().min(0).max(100).required().label("Stock"),
    dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
  }), []);

  const validateForm = useCallback((data) => {
    // Exclude file fields from validation
    const { poster, posterUrl, ...dataToValidate } = data;

    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(dataToValidate, options);
    if (!error) return {};

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  }, [schema]);

  const mapToViewModel = useCallback((movie) => ({
    _id: movie._id,
    title: movie.title,
    genreId: movie.genre._id,
    numberInStock: movie.numberInStock,
    dailyRentalRate: movie.dailyRentalRate,
    posterUrl: movie.posterUrl || '',
  }), []);

  const { data, renderInput, renderSelect, renderImageUpload, renderButton, handleChange, handleSubmit, errors, setErrors, setData } = useForm(
    {
      _id: "",
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
      poster: null,
      posterUrl: "",
    },
    validateForm
  );

  const { data: genresData, loading: genresLoading } = useFetch(
    async () => {
      const { data } = await getGenres();
      return data;
    },
    []
  );

  const movieId = match.params.id;
  const { data: movieData, loading: movieLoading } = useFetch(
    async () => {
      if (movieId === "new") return null;
      const { data } = await getMovie(movieId);
      return data;
    },
    [movieId]
  );

  useEffect(() => {
    if (movieData) {
      const viewModel = mapToViewModel(movieData);
      setData(viewModel);
    }
  }, [movieData, setData, mapToViewModel]);

  useEffect(() => {
    if (movieData === null && movieId !== "new" && !movieLoading) {
      history.replace("/not-found");
    }
  }, [movieData, movieId, movieLoading, history]);

  const loading = genresLoading || (movieId !== "new" && movieLoading);

  const doSubmit = useCallback(async () => {
    try {
      // Validate poster is required for new movies
      if (!data._id && !data.poster) {
        setErrors((prevErrors) => ({ ...prevErrors, poster: "Poster is required for new movies" }));
        return;
      }

      const movie = {
        _id: data._id,
        title: data.title,
        genreId: data.genreId,
        numberInStock: Number(data.numberInStock),
        dailyRentalRate: Number(data.dailyRentalRate),
        poster: data.poster, // File object for upload (null for updates without new image)
      };

      await saveMovie(movie);
      history.push("/movies");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errorMessage = ex.response.data;
        // Check if it's a validation error for poster
        if (errorMessage.includes("poster") || errorMessage.includes("Poster")) {
          setErrors((prevErrors) => ({ ...prevErrors, poster: errorMessage }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, title: errorMessage }));
        }
      } else {
        console.error("Error saving movie:", ex);
      }
    }
  }, [data, history, setErrors]);

  if (loading) return <FormSkeleton />;

  return (
    <div className="row">
      {/* Movie Poster Display */}
      {(data.posterUrl || data.poster) && (
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <img
              src={data.posterUrl || (data.poster && URL.createObjectURL(data.poster))}
              alt={data.title || "Movie Poster"}
              className="card-img-top"
              style={{
                height: '400px',
                objectFit: 'cover',
                width: '100%'
              }}
            />
            {!isAdmin && user && (
              <div className="card-body">
                <Link
                  to={`/rentals/new?movieId=${data._id}`}
                  className="btn btn-success w-100"
                >
                  🎬 Rent Movie
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={data.posterUrl || data.poster ? "col-md-8" : "col-md-12"}>
        <h2 className="mb-3">{isAdmin ? (movieId === "new" ? "New Movie" : "Edit Movie") : "Movie Details"}</h2>

        {user && !isAdmin && !data.posterUrl && (
          <Link
            to={`/rentals/new?movieId=${data._id}`}
            className="btn btn-success mb-4"
          >
            🎬 Rent Movie
          </Link>
        )}

        {isAdmin && (
          <form onSubmit={handleSubmit(doSubmit)}>
            {renderInput("title", "Title")}
            {renderSelect("genreId", "Genre", genresData || [], "_id", "name")}
            {renderInput("numberInStock", "Stock", "number")}
            {renderInput("dailyRentalRate", "Rate", "number")}
            {renderImageUpload("poster", "Movie Poster")}
            {renderButton("Save")}
          </form>
        )}

        {!isAdmin && data.posterUrl && (
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{data.title}</h5>
              <p className="card-text">
                <strong>Genre:</strong> {genresData?.find(g => g._id === data.genreId)?.name || 'N/A'}<br />
                <strong>Stock:</strong> {data.numberInStock}<br />
                <strong>Rate:</strong> Rs {data.dailyRentalRate}/day
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieForm;
