const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const { JWT_SECRET } = require("../config/keys");

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password)
    return res.status(422).json({ error: "Fill all the fields" });

  User.findOne({ email: email })
    .then((prev_user) => {
      if (prev_user) return res.json({ error: "Email Id already exists" });
      bcrypt.hash(password, 12).then((hashedpass) => {
        const user = new User({
          name,
          email,
          password: hashedpass,
        });
        user
          .save()
          .then((user) => {
            return res.json({ message: "Registered Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: "Invalid Login" });
  }

  User.findOne({ email: email })
    .then((saveduser) => {
      if (!saveduser)
        return res.json({ error: "No user exists with this Email ID" });

      bcrypt
        .compare(password, saveduser.password)
        .then((match) => {
          if (!match) return res.json({ error: "Invalid email/password" });

          //res.json({message : "Signed In Successfully"})
          const token = jwt.sign({ _id: saveduser._id }, JWT_SECRET);
          const { _id, name, email, followers, followings } = saveduser;
          res.json({
            token,
            user: { _id, name, email, followers, followings },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
