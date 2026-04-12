const express = require("express");
const { Rental } = require("../models/rental");

const router = express.Router();

// Total revenue (completed rentals only)
router.get("/revenue", async (req, res) => {
  const result = await Rental.aggregate([
    { $match: { dateReturned: { $ne: null } } },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $ifNull: [
              "$totalCost",
              { $ifNull: ["$rentalFee", { $ifNull: ["$payment.amount", 0] }] },
            ],
          },
        },
      },
    },
  ]);

  res.send(result[0] || { totalRevenue: 0 });
});

// Total rentals
router.get("/count", async (req, res) => {
  const count = await Rental.countDocuments();
  res.send({ totalRentals: count });
});

module.exports = router;