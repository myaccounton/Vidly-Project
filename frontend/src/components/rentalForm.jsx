import React, { useEffect, useState } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import Select from "./common/select";
import { toast } from "react-toastify";
import queryString from "query-string";
import { getMovies } from "../services/movieService";
import { saveRental } from "../services/rentalService";

const RentalForm = ({ history, location }) => {


  const [data, setData] = useState({
    movieId: ""
  });

  const [errors, setErrors] = useState({});
  const [movies, setMovies] = useState([]);

  const schema = {
    movieId: Joi.string().required().label("Movie")
  };

  useEffect(() => {
    async function loadData() {
        const { data: movies } = await getMovies();
        setMovies(movies);

        const { movieId } = queryString.parse(location.search);
        if (movieId) {
          setData({ movieId });
        }
      } 

    loadData();
  }, [location.search]);

  const handleSubmit = async () => {
    try {
      await saveRental({ movieId: data.movieId });

      toast.success("Movie rented successfully!");
      history.push("/movies");
    } catch (ex) {
      toast.error(ex.response?.data || "Something went wrong");
    }
  };


  return (
    <div className="col-md-6">
      <h2 className="mb-4">Rent Movie</h2>

      <Form
        data={data}
        setData={setData}
        errors={errors}
        setErrors={setErrors}
        schema={schema}
        onSubmit={handleSubmit}
      >
        

        <Select
          name="movieId"
          label="Movie"
          options={movies}
          valueProperty="_id"
          labelProperty="title"
        />

        <button type="submit" className="btn btn-primary">
          Confirm Rental
        </button>
      </Form>
    </div>
  );
};

export default RentalForm;
