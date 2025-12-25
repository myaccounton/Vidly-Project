const mongoose = require("mongoose");
const { Genre } = require("./models/genre");
const { Movie } = require("./models/movie");
const config = require("config");

async function seed() {
  await mongoose.connect("mongodb://localhost/vidly");

  await Genre.deleteMany({});
  await Movie.deleteMany({});

  const genres = await Genre.insertMany([
    { name: "Action" },
    { name: "Comedy" },
    { name: "Thriller" }
  ]);

  await Movie.insertMany([
    {
      title: "Inception",
      genre: { _id: genres[0]._id, name: genres[0].name },
      numberInStock: 10,
      dailyRentalRate: 8
    },
    {
      title: "Hangover",
      genre: { _id: genres[1]._id, name: genres[1].name },
      numberInStock: 5,
      dailyRentalRate: 8
    }
  ]);

  console.log("Database seeded successfully...");
  process.exit();
}

seed();
