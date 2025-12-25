const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User,validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const asyncHandler = require('../middleware/async');
const constants = require('../utils/constants');
const router = express.Router();

router.get('/me', auth, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
}));

router.post('/', asyncHandler(async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email:req.body.email});
    if(user) return res.status(400).send(constants.ERRORS.USER_EXISTS);

    user = new User(_.pick(req.body,['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();

    const token = user.generateAuthToken();
    res
    .header('x-auth-token',token)
    .header('access-control-expose-headers','x-auth-token')
    .send(_.pick(user,['id','name','email']));
}));

module.exports = router;