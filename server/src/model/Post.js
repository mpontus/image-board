const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    imageId: String,
    imageUrl: String,
    imageWidth: Number,
    imageHeight: Number,
    author: {
      id: String,
      name: String,
      avatarUrl: String
    },
    likes: [String],
    likesCount: Number
  },
  {
    timestamps: {
      createdAt: "timestamp"
    }
  }
);

module.exports = mongoose.model("Post", postSchema);
