const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  id: String,
  name: String,
  avatarUrl: String
});

const postSchema = new mongoose.Schema({
  imageUrl: String,
  author: authorSchema,
  likesByUser: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  likesCount: Number
});

module.exports = mongoose.model("Post", postSchema);
