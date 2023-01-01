const express = require('express');
const router = express.Router();
const passport= require('passport')
const User= require('../models/user')
const catchAsync = require('../utility/catchAsyncError');


router.get('/register', (req, res) => {/*show register page */
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {/*after submit the register form route*/
  try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
          if (err) return next(err);
          req.flash('success', 'Welcome to Yelp Camp!');
          res.redirect('/campgrounds');
      })
  } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
  }
}));
router.get('/login', (req, res) => {/*go to login page*/ 
  res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
})//post route in login page

router.get('/logout', (req, res) => {
  req.logout(function (err) {
  // if (err) { return next(err); }
  req.flash('success', "Goodbye!");
  res.redirect('/campgrounds');
  });
  })

module.exports= router;