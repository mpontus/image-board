const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  id: String,
  name: String,
  avatarUrl: String
});

const postSchema = new mongoose.Schema(
  {
    imageUrl: String,
    imageWidth: Number,
    imageHeight: Number,
    author: authorSchema,
    likesByUser: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    likesCount: Number
  },
  {
    timestamps: {
      createdAt: "created_at"
    }
  }
);

module.exports = mongoose.model("Post", postSchema);
