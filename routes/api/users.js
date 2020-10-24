const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

router.get("/", (req, res) => res.send("users database"));

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  console.log(req.body);
  // Form validation

  // const { errors, isValid } = validateRegisterInput(req.body);

  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({ phoneNumber: req.body.phoneNumber }).then(user => {
    if (user) {
      return res.status(400).json({ phoneNumber: "phone number is already exists" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              delete user.password;
              delete user.date;
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  // const { errors, isValid } = validateLoginInput(req.body);

  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;

  // Find user by email
  User.findOne({ phoneNumber }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ usernotfound: "Username or Password incorrect" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ usernotfound: "Username or Password incorrect" });
      }
    });
  });
});

router.post("/verify", async (req, res) => {
  const {phoneNumber, accessToken} = req.body;
  const user = await User.findOne({phoneNumber}).exec();
  if(!user) {
    res.status(404).json({usernotfound: "User not found"});
  }
  // verify the token with google if succeded set it true
  user.isVerfied = true;
  await user.save();
  res.status(200).json({ success: true, message: "Account has been verfied"});
});

router.post("/forgot-password", async (req, res) => {
  const {phoneNumber} = req.body;
  console.log(phoneNumber);
  const user = await User.findOne({phoneNumber}).exec();
  if(!user) {
    res.status(404).json({usernotfound: "User not found"});
  }
  res.status(200).json({success: true});
});

router.post("/reset-password",  async (req, res) => {
  const {phoneNumber, password} = req.body;
  console.log(phoneNumber);
  const user = await User.findOne({phoneNumber}).exec();
  if(!user) {
    res.status(404).json({usernotfound: "User not found"});
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        throw err;
      }
      user.password = hash;
      user
        .save()
        .then(user => {
          delete user.password;
          delete user.date;
          res.json(user);
        })
        .catch(err => console.log(err));
    });
  });
});
module.exports = router;
