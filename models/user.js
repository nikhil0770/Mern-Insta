const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  followings: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  mypic:{
    type:String,
  }
});

mongoose.model("User", userschema);
