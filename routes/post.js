const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

const requirelogin = require("../middlewares/requirelogin");

router.get("/allposts", requirelogin, (req, res) => {
  Post.find()
    .populate("postedby", "_id name")
    .sort("-createdAt")
    .populate("comments.commentby", "_id name")
    .then((posts) => {
      //console.log(posts, req.user);
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requirelogin, (req, res) => {
  const { title, description, postedby, image } = req.body;
  if (!title) return res.json({ error: "Title field is empty" });

  req.user.password = undefined;
  req.user.email = undefined;
  const post = new Post({
    title,
    description,
    image,
    postedby: req.user,
  });

  post
    .save()
    .then((posted) => {
      //console.log(posted)
      res.json({ message: "Posted Successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", requirelogin, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name")
    .sort("-createdAt")
    .then((mypost) => {
      User.findOne({ _id: req.user._id }).then((userdata) => {
        res.json({ mypost, userdata });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postid,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.json({ error: err });
    } else {
      res.json({ result });
    }
  });
});

router.put("/dislike", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postid,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.json({ error: err });
    } else {
      res.json({ result });
    }
  });
});

router.put("/comment", requirelogin, (req, res) => {
  const comment = {
    text: req.body.text,
    commentby: req.user._id,
  };
  //console.log(req.body.postid);
  Post.findByIdAndUpdate(
    req.body.postid,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.commentby", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json({ result });
      }
    });
});

router.delete("/deletepost/:postid", requirelogin, (req, res) => {
  Post.findOne({ _id: req.params.postid })
    .populate("postedby", "_id")
    .exec((err, result) => {
      if (err || !result) return res.json({ error: err });

      if (result.postedby._id.toString() == req.user._id.toString()) {
        result
          .remove()
          .then((post) => {
            res.json({ message: "Deleted Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.delete("/deletecomment/:postid/:commentid", requirelogin, (req, res) => {
  Post.updateOne(
    { _id: req.params.postid },
    {
      $pull: { comments: { _id: req.params.commentid } },
    }
  ).then((result) => {
    res.json({ result });
  });
});

router.get("/following", requirelogin, (req, res) => {
  //finding id inside my following list
  Post.find({ postedby: { $in: req.user.followings } })
    .sort("-createdAt")
    .populate("postedby", "_id name")
    .populate("comments.commentby", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/profilepic", requirelogin, (req, res) => {
  const { mypic } = req.body;
  req.user.password = undefined;
  req.user.email = undefined;

  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      mypic: mypic,
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.json({ message: "Profile Pic Updated" });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
