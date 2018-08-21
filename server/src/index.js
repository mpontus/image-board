require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const cloudinary = require("cloudinary");
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
const shortid = require("shortid");
const Post = require("./model/Post");

const HOST = process.env.IMAGE_BOARD_SERVER_HOST || "0.0.0.0";
const PORT = process.env.IMAGE_BOARD_SERVER_PORT || 8080;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
});

cloudinary.config(process.env.CLOUDINARY_URL);

const storage = cloudinaryStorage({
  cloudinary,
  folder: process.env.CLOUDINARY_FOLDER,
  allowedFormats: ["jpg", "png"],
  filename: function(req, file, cb) {
    cb(undefined, shortid());
  }
});

const upload = multer({ storage });

const requireAuth = jwt({
  secret: Buffer.from(process.env.AUTH0_SECRET),
  audience: Buffer.from(process.env.AUTH0_CLIENT_ID)
});

const app = express();

app.use(cors());

app.post(
  "/api/posts",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const post = await Post.create({
        imageUrl: req.file.url,
        author: {
          id: req.user.id,
          name: req.user.name,
          avatarUrl: req.user.picture
        },
        likesByUser: {
          [req.user.id]: true
        },
        likesCount: 1
      });

      res.json({
        id: post._id,
        imageUrl: post.imageUrl,
        author: post.author,
        likes: post.likesCount,
        isLiked: post.likesByUser[user.id]
      });
    } catch (error) {
      next(error);
    }
  }
);

app.use((err, req, res, next) => {
  res.status(500).json({
    error: true,
    message: err.message
  });
});

const server = app.listen(PORT, HOST, () => {
  const { address, port } = server.address();

  console.log(`Server listening on http://${address}:${port}/`);
});
