const request = require("supertest");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const { Customer } = require("../../models/customer");
const { User } = require("../../models/user");

let server;

describe("/api/rentals", () => {
  beforeEach(async () => {
    server = require("../../index");
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await Customer.deleteMany({});
    await User.deleteMany({});
    delete require.cache[require.resolve("../../index")];
  });

  describe("GET /", () => {
    beforeEach(async () => {
      await Rental.deleteMany({});
    });

    it("should return all rentals", async () => {
      const oid = () => new mongoose.Types.ObjectId();
      await Rental.collection.insertMany([
        {
          customer: { _id: oid(), name: "A", email: "a@b.com" },
          movie: { _id: oid(), title: "T1", dailyRentalRate: 2 },
          dailyRate: 2,
          initialPayment: 2,
          paymentStatus: "PAID",
          dateReturned: new Date(),
          totalCost: 2,
        },
        {
          customer: { _id: oid(), name: "B", email: "b@c.com" },
          movie: { _id: oid(), title: "T2", dailyRentalRate: 3 },
          dailyRate: 3,
          initialPayment: 3,
          paymentStatus: "PARTIAL",
        },
      ]);

      const res = await request(server).get("/api/rentals");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("POST / and return flow", () => {
    let movieId;
    let token;
    let movie;
    let user;

    beforeEach(async () => {
      await Rental.deleteMany({});
      await Movie.deleteMany({});
      await User.deleteMany({});

      user = new User({
        name: "testuser",
        email: "testuser@test.com",
        password: "password1",
      });
      await user.save();
      token = user.generateAuthToken();

      movie = new Movie({
        title: "12345",
        dailyRentalRate: 2,
        genre: { name: "12345" },
        numberInStock: 10,
        posterUrl: "https://example.com/p.jpg",
      });
      await movie.save();

      movieId = movie._id;
    });

    const postRental = (body) =>
      request(server)
        .post("/api/rentals")
        .set("x-auth-token", token)
        .send(body);

    it("should return 400 if paymentStatus is not SUCCESS", async () => {
      const res = await postRental({
        movieId,
        initialPayment: 2,
        paymentStatus: "FAILED",
        paymentMethod: "UPI",
      });
      expect(res.status).toBe(400);
    });

    it("should return 400 if initialPayment does not match one-day rate", async () => {
      const res = await postRental({
        movieId,
        initialPayment: 99,
        paymentStatus: "SUCCESS",
        paymentMethod: "UPI",
      });
      expect(res.status).toBe(400);
    });

    it("should create rental with PARTIAL status and stock decremented", async () => {
      const res = await postRental({
        movieId,
        initialPayment: 2,
        paymentStatus: "SUCCESS",
        paymentMethod: "Card",
      });
      expect(res.status).toBe(200);
      expect(res.body.paymentStatus).toBe("PARTIAL");
      expect(res.body.initialPayment).toBe(2);
      expect(res.body.dailyRate).toBe(2);

      const movieInDb = await Movie.findById(movieId);
      expect(movieInDb.numberInStock).toBe(9);
    });

    it("should complete return with PUT and final payment", async () => {
      const create = await postRental({
        movieId,
        initialPayment: 2,
        paymentStatus: "SUCCESS",
        paymentMethod: "UPI",
      });
      const rentalId = create.body._id;

      const rental = await Rental.findById(rentalId);
      rental.dateOut = new Date(Date.now() - 3 * 86400000);
      await rental.save();

      const res = await request(server)
        .put(`/api/rentals/${rentalId}/return`)
        .set("x-auth-token", token)
        .send({ paymentStatus: "SUCCESS", paymentMethod: "Cash" });

      expect(res.status).toBe(200);
      expect(res.body.paymentStatus).toBe("PAID");
      expect(res.body.totalCost).toBeGreaterThanOrEqual(2);
      expect(res.body.finalPaymentAmount).toBeGreaterThan(0);

      const movieInDb = await Movie.findById(movieId);
      expect(movieInDb.numberInStock).toBe(10);
    });

    it("GET /my should return shaped rows", async () => {
      await postRental({
        movieId,
        initialPayment: 2,
        paymentStatus: "SUCCESS",
        paymentMethod: "UPI",
      });

      const res = await request(server)
        .get("/api/rentals/my")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("movieTitle");
      expect(res.body[0]).toHaveProperty("days");
      expect(res.body[0]).toHaveProperty("totalCost");
      expect(res.body[0]).toHaveProperty("initialPayment");
      expect(res.body[0]).toHaveProperty("remainingAmount");
    });
  });
});
