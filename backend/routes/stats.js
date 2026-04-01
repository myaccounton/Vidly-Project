const express = require("express");
const { Rental } = require("../models/rental");

const router = express.Router();

// Total revenue
router.get("/revenue", async (req, res) => {
  const result = await Rental.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$rentalFee" }
      }
    }
  ]);

  res.send(result[0] || { totalRevenue: 0 });
});

// Total rentals
router.get("/count", async (req, res) => {
  const count = await Rental.countDocuments();
  res.send({ totalRentals: count });
});

module.exports = router;