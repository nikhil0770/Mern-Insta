const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

const requirelogin = require("../middlewares/requirelogin");

router.get("/user/:id", requirelogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedby: req.params.id })

        .populate("postedby", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.json({ error: err });
          }

          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.json({ error: "User not found" });
    });
});

router.put("/follow", requirelogin, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.body.uid },
    {
      $push: { followers: req.user._id },
    },
    { new: true }
  )
    .select("-password")
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $push: { followings: req.body.uid },
        },
        { new: true }
      )
        .select("-password")
        .exec((err, result) => {
          if (err) return res.json({ error: err });

          res.json({ result });
        });
    });
});

router.put("/unfollow", requirelogin, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.body.uid },
    {
      $pull: { followers: req.user._id },
    },
    { new: true }
  )
    .select("-password")
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $pull: { followings: req.body.uid },
        },
        { new: true }
      )
        .select("-password")
        .exec((err, result) => {
          if (err) return res.json({ error: err });

          res.json({ result });
        });
    });
});

module.exports = router;
