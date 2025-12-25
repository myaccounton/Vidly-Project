const { Watchlist } = require('../models/watchlist');
const auth = require('../middleware/auth');
const express = require('express');
const asyncHandler = require('../middleware/async');
const router = express.Router();

router.post("/", auth, asyncHandler(async (req, res) => {
  const item = new Watchlist({
    userId: req.user._id,
    movieId: req.body.movieId
  });

  await item.save();
  res.send(item);
}));

router.get("/", auth, asyncHandler(async (req, res) => {
  const list = await Watchlist.find({ userId: req.user._id }).populate("movieId");
  res.send(list);
}));

module.exports = router;
