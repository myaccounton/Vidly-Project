const config = require('config');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const express = require('express');
const asyncHandler = require('../middleware/async');
const constants = require('../utils/constants');
const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(constants.ERRORS.INVALID_EMAIL_PASSWORD);

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validPassword)
    return res.status(400).send(constants.ERRORS.INVALID_EMAIL_PASSWORD);

   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send(token);
}));


function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router;