require("dotenv-safe").config();
const express = require("express");
const paginate = require("express-paginate");
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

const serializePost = user => post => ({
  id: post._id,
  imageUrl: post.imageUrl,
  imageWidth: post.imageWidth,
  imageHeight: post.imageHeight,
  author: {
    id: post.author.id,
    name: post.author.name,
    avatarUrl: post.author.avatarUrl
  },
  likes: post.likesCount,
  isLiked: user ? post.likesByUser[user.sub] : false,
  createdAt: post.createdAt
});

app.get("/api/posts", paginate.middleware(20, 20), async (req, res, next) => {
  try {
    const [total, posts] = await Promise.all([
      Post.find({})
        .countDocuments()
        .exec(),
      Post.find({})
        .skip(req.skip)
        .limit(req.limit)
        .lean()
        .exec()
    ]);

    res.json({
      total,
      items: posts.map(serializePost(req.user))
    });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/posts",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const post = await Post.create({
        imageUrl: req.file.url,
        imageWidth: req.file.width,
        imageHeight: req.file.height,
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

      res.json(serializePost(req.user)(post));
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
