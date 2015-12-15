var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/hotels', function (req, res, next) {
  if (!req.session.user) {
    return res.json({ result: false, message: 'You need to login before you can view your saved hotels', data: null });
  }
  User.findOne({ _id: req.session.user._id }, function (error, user) {
    if (error) {
      res.status(500);
      return res.json({ result: false, message: 'Internal server error', data: null });
    }
    return res.json({ result: true, message: 'User hotels found', data: user.hotels });
  });
});

router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.json({ result: false, message: 'Unauthorised access. You need to login!', data: null });
  else
    return res.json({ result: true, message: 'This is the user home', data: null });
});

router.post('/signup', function (req, res, next) {
  console.log(req.body);
  if (!req.body)
    return res.json({ result: false, message: 'Invalid parameters', data: null });
  if (!req.body.email || !req.body.password)
    return res.json({ result: false, message: 'Invalid parameters', data: null });
  var email = req.body.email,
    password = req.body.password;
  var user = new User();
  user.email = email;
  user.password = password;
  user.save(function (error, savedUser) {
    if (error) {
      res.status(500);
      return res.json({ result: false, message: 'Internal server error', data: null });
    }
    return res.json({ result: true, message: 'User successfully created!', data: { email: savedUser.email, hotels: savedUser.hotels }});
  });
});

router.post('/login', function (req, res, next) {
  if (req.session.user) {
    return res.json({ result: false, message: 'You are already logged in. Go to /users/logout to logout and then login!', data: null });
  }
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(500);
    return res.json({ result: false, message: 'Invalid parameters', data: null });
  }
  User
    .findOne({ email: req.body.email })
    .exec(function (error, user) {
      if (error) {
        res.status(500);
        return res.json({ result: false, message: 'Internal server error', data: null });
      }
      if (!user)
        return res.json({ result: false, message: 'No user found with that email id', data: null });
      req.session.user = { email: user.email, _id: user._id };
      return res.json({ result: false, message: 'Login successfull', data: null });
    });
});

router.get('/logout', function (req, res, next) {
  if (req.session.user)
    delete req.session.user;
  return res.json({ result: false, message: 'Logged out successfully', data: null });
});

router.post('/save_hotel', function (req, res, next) {
  if (!req.session.user) {
    return res.json({ result: false, message: 'You need to login before you can save a hotel entry', data: null });
  }
  var hotel = req.body;
  User.findOne({ _id: req.session.user._id }, function (error, user) {
    if (error) {
      res.status(500);
      return res.json({ result: false, message: 'Internal server error', data: null });
    }
    user.hotels.push(hotel);
    user.save(function (err, savedUser) {
      if (err) {
        res.status(500);
        return res.json({ result: false, message: 'Internal server error', data: null });
      }
      return res.json({ result: true, message: 'User saved successfully', data: savedUser.hotels });
    });
  });
});

module.exports = router;
