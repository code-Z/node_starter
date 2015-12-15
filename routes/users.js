var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.session.user)
    return res.json({ result: false, message: 'Unauthorised access. You need to login!', data: null });
  else
    return res.json({ result: true, message: 'This is the user home', data: null });
});

router.post('/signup', function (req, res, next) {
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
      req.session.user = { email: user.email };
      return res.json({ result: false, message: 'Login successfull', data: null });
    });
});

router.get('/logout', function (req, res, next) {
  if (req.session.user)
    delete req.session.user;
  return res.json({ result: false, message: 'Logged out successfully', data: null });
});

module.exports = router;
