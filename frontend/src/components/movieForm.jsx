import React, { useEffect, useState } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import Input from "./common/input";
import Select from "./common/select";
import auth from "../services/authService";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { Link } from "react-router-dom";

const MovieForm = ({ match, history }) => {
  const user = auth.getCurrentUser();
  const isAdmin = user && user.isAdmin;

  const [data, setData] = useState({
    _id: "",
    title: "",
    genreId: "",
    numberInStock: "",
    dailyRentalRate: "",
  });

  const [genres, setGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const schema = {
    _id: Joi.string().allow(""),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().min(0).max(100).required().label("Stock"),
    dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
  };

  useEffect(() => {
    async function loadData() {
      const { data: genres } = await getGenres();
      setGenres(genres);

      const movieId = match.params.id;
      if (movieId === "new") {
        setLoading(false);
        return;
      }

      try {
        const { data: movie } = await getMovie(movieId);
        setData(mapToViewModel(movie));
        setLoading(false);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          history.replace("/not-found");
      }
    }

    loadData();
  }, [match, history]);

  const mapToViewModel = movie => ({
    _id: movie._id,
    title: movie.title,
    genreId: movie.genre._id,
    numberInStock: movie.numberInStock,
    dailyRentalRate: movie.dailyRentalRate,
  });

  const handleSubmit = async () => {
  try {
    const movie = {
      _id: data._id,
      title: data.title,
      genreId: data.genreId,
      numberInStock: Number(data.numberInStock),
      dailyRentalRate: Number(data.dailyRentalRate),
    };

    await saveMovie(movie);
    history.push("/movies");
  } catch (ex) {
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div className="col-md-6">
      <h2 className="mb-3">{isAdmin ? "Edit Movie" : "Movie Details"}</h2>
      {user && !isAdmin && (
        <Link
          to={`/rentals/new?movieId=${data._id}`}
          className="btn btn-success mb-4"
        >
          🎬 Rent Movie
        </Link>
      )}

      {isAdmin && (
        <Form
          data={data}
          setData={setData}
          errors={errors}
          setErrors={setErrors}
          schema={schema}
          onSubmit={handleSubmit}
        >
          <Input name="title" label="Title" />

          <Select
            name="genreId"
            label="Genre"
            options={genres}
            valueProperty="_id"
            labelProperty="name"
          />
          <Input name="numberInStock" label="Stock" type="number" />
          <Input name="dailyRentalRate" label="Rate" type="number" />

          <button type="submit" className="btn btn-primary">
         Save
         </button>
        </Form>
      )}
    </div>
  );
};

export default MovieForm;