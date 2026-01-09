/**
 * Legacy module retained from original Vidly architecture.
 * Current implementation uses user-based rentals.
 */

const {Customer,validate} = require('../models/customer');
const express = require('express');
const router = express.Router();

const asyncHandler = require('../middleware/async');
const notFound = require('../middleware/notFound');

router.get('/', asyncHandler(async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return notFound('Customer')(req, res);
  res.send(customer);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
     name: req.body.name,
     phone: req.body.phone,
     isGold: req.body.isGold
     });
  await customer.save();
  
  res.send(customer);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
     { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
     }, {
    new: true
  });

  if (!customer) return notFound('Customer')(req, res);
  
  res.send(customer);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return notFound('Customer')(req, res);
  res.send(customer);
}));

module.exports = router;