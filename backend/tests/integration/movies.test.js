const request = require('supertest');
const mongoose = require('mongoose');
const { Movie } = require('../../models/movie');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;

describe('/api/movies', () => {
  beforeEach(() => { server = require('../../index'); });
  
  afterEach(async () => {
    await Movie.deleteMany({});
    await Genre.deleteMany({});
    await server.close();
  });

  describe('GET /', () => {
    it('should return all movies', async () => {
      await Movie.collection.insertMany([
        { title: 'movie1', genre: { name: 'genre1' }, numberInStock: 1, dailyRentalRate: 1 },
        { title: 'movie2', genre: { name: 'genre2' }, numberInStock: 1, dailyRentalRate: 1 }
      ]);

      const res = await request(server).get('/api/movies');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(m => m.title === 'movie1')).toBeTruthy();
      expect(res.body.some(m => m.title === 'movie2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a movie if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const movie = new Movie({ title: 'movie1', genre, numberInStock: 1, dailyRentalRate: 1 });
      await movie.save();

      const res = await request(server).get('/api/movies/' + movie._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', movie.title);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/movies/1');
      expect(res.status).toBe(404);
    });

    it('should return 404 if no movie with given id exists', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get('/api/movies/' + id);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let title;
    let genreId;
    let numberInStock;
    let dailyRentalRate;

    const exec = async () => {
      return await request(server)
        .post('/api/movies')
        .set('x-auth-token', token)
        .send({ title, genreId, numberInStock, dailyRentalRate });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      
      const genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      genreId = genre._id;
      title = 'movie1';
      numberInStock = 10;
      dailyRentalRate = 2;
    });

    it('should return 400 if title is less than 5 chars', async () => {
      title = '1234';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if genreId is invalid', async () => {
      genreId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save the movie if input is valid', async () => {
      await exec();
      const movie = await Movie.findOne({ title: 'movie1' });
      expect(movie).not.toBeNull();
    });

    it('should return the movie if input is valid', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'movie1');
    });
  });

  describe('PUT /:id', () => {
    let token;
    let movie;
    let genre;
    let newTitle;
    let newGenreId;
    let newStock;
    let newRate;
    let movieId;

    const exec = async () => {
      return await request(server)
        .put('/api/movies/' + movieId)
        .set('x-auth-token', token)
        .send({ 
          title: newTitle, 
          genreId: newGenreId, 
          numberInStock: newStock, 
          dailyRentalRate: newRate 
        });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      
      genre = new Genre({ name: 'Comedy' });
      await genre.save();

      movie = new Movie({ 
        title: 'oldTitle', 
        genre: { _id: genre._id, name: genre.name },
        numberInStock: 5, 
        dailyRentalRate: 2 
      });
      await movie.save();

      movieId = movie._id;
      newTitle = 'newTitle';
      newGenreId = genre._id;
      newStock = 10;
      newRate = 4;
    });

    it('should return 404 if invalid id is passed', async () => {
      movieId = '1';
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should update the movie if input is valid', async () => {
      await exec();
      const updatedMovie = await Movie.findById(movie._id);
      expect(updatedMovie.title).toBe('newTitle');
      expect(updatedMovie.genre.name).toBe('Comedy');
      expect(updatedMovie.numberInStock).toBe(10);
      expect(updatedMovie.dailyRentalRate).toBe(4);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let movie;
    let genre;

    beforeEach(async () => {
      genre = new Genre({ name: 'genre1' });
      await genre.save();

      movie = new Movie({ 
        title: 'movie1', 
        genre: { _id: genre._id, name: genre.name },
        numberInStock: 5, 
        dailyRentalRate: 2 
      });
      await movie.save();

      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server)
        .delete('/api/movies/1')
        .set('x-auth-token', token);
      
      expect(res.status).toBe(404);
    });

    it('should delete the movie if input is valid', async () => {
      const res = await request(server)
        .delete('/api/movies/' + movie._id)
        .set('x-auth-token', token);
      
      expect(res.status).toBe(200);
      const movieInDb = await Movie.findById(movie._id);
      expect(movieInDb).toBeNull();
    });
  });
});