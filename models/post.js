const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    postedby: {
      type: ObjectId,
      ref: "User",
    },
    comments: [
      {
        text: String,
        commentby: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Post", postschema);
