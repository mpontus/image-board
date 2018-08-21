require("dotenv-safe").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
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

const secret = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

const requireAuth = jwt({
  secret,
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
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
          id: req.user.sub,
          name: req.user.nickname,
          avatarUrl: req.user.picture
        },
        likesByUser: {
          [req.user.sub]: true
        },
        likesCount: 1
      });

      res.json({
        id: post.id,
        imageUrl: post.imageUrl,
        author: post.author,
        likes: post.likesCount,
        isLiked: post.likesByUser[req.user.sub],
        createdAt: post.createdAt
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
