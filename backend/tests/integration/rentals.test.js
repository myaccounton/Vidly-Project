const request = require('supertest');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const { Customer } = require('../../models/customer');
const { User } = require('../../models/user');

let server;

describe('/api/rentals', () => {
  beforeEach(async () => {
    server = require('../../index');
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await Customer.deleteMany({});
    delete require.cache[require.resolve('../../index')];
  });

  describe('GET /', () => {
    it('should return all rentals', async () => {
      await Rental.collection.insertMany([
        { customer: { name: '12345', phone: '12345' }, movie: { title: '12345', dailyRentalRate: 2 } },
        { customer: { name: '67890', phone: '67890' }, movie: { title: '67890', dailyRentalRate: 2 } }
      ]);

      const res = await request(server).get('/api/rentals');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('POST /', () => {
    let customerId;
    let movieId;
    let token;
    let movie;
    let customer;

    const exec = () => {
      return request(server)
        .post('/api/rentals')
        .set('x-auth-token', token)
        .send({ customerId, movieId });
    };

    beforeEach(async () => {
      // Clean up first
      await Rental.deleteMany({});
      await Movie.deleteMany({});
      await Customer.deleteMany({});

      token = new User().generateAuthToken();

      customer = new Customer({ name: '12345', phone: '12345' });
      await customer.save();

      movie = new Movie({ title: '12345', dailyRentalRate: 2, genre: { name: '12345' }, numberInStock: 10 });
      await movie.save();

      customerId = customer._id;
      movieId = movie._id;
    });

    it('should return 400 if customerId is invalid', async () => {
      customerId = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is invalid', async () => {
      movieId = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if movie is out of stock', async () => {
      movie.numberInStock = 0;
      await movie.save();

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should save the rental if it is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      
      const rental = await Rental.findOne({ 'customer._id': customerId });
      expect(rental).not.toBeNull();
    });

    it('should decrease the movie stock if rental is created', async () => {
      await exec();
      const movieInDb = await Movie.findById(movieId);
      expect(movieInDb).not.toBeNull();
      expect(movieInDb.numberInStock).toBe(9);
    });

    it('should return the rental if it is valid', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('customer');
      expect(res.body).toHaveProperty('movie');
    });
  });
});