import * as cors from "cors";
import * as dotenv from "dotenv-safe";
import * as express from "express";
import * as jwt from "express-jwt";
import * as paginate from "express-paginate";
import * as jwksRsa from "jwks-rsa";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as multer from "multer";
import * as shortid from "shortid";
import * as winston from "winston";
import Post from "./model/Post";
import createStorage from "./storage/createStorage";

dotenv.config();

const storage = createStorage({
  storageType: process.env.CLOUDINARY_STUB ? "test" : "cloudinary",
  cloudinaryUrl: process.env.CLOUDINARY_URL,
  storageParams: {
    folder: process.env.CLOUDINARY_FOLDER || "",
    allowedFormats: ["jpg", "png"],
    filename: (req, file, cb) => cb(null, shortid())
  }
});

mongoose.connect(
  process.env.MONGODB_URI || "",
  {
    useNewUrlParser: true
  }
);

const upload = multer({
  storage
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

const app = express();

app.use(morgan("combined"));
app.use(cors());

app.use(
  jwt(
    process.env.NODE_ENV === "test"
      ? {
          secret: process.env.JWT_SECRET || "",
          credentialsRequired: false
        }
      : {
          secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
          }),
          audience: process.env.AUTH0_CLIENT_ID,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ["RS256"],
          credentialsRequired: false
        }
  )
);

const requireAuth: express.RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).end();
  } else {
    next();
  }
};

interface User {
  sub: string;
  nickname: string;
  picture: string;
}

type ModelType<T> = T extends mongoose.Model<infer R> ? R : any;

const serializePost = (user: User) => (post: ModelType<typeof Post>) => ({
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
  isLiked: user ? post.likes.includes(user.sub) : false,
  timestamp: post.timestamp
});

app.get("/api/posts", paginate.middleware(5, 5), async (req, res, next) => {
  try {
    const [total, posts] = await Promise.all([
      Post.find({})
        .countDocuments()
        .exec(),

      Post.find({})
        .sort("-timestamp")
        .skip(req.skip as number)
        .limit(req.query.limit)
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
      if (!req.user.nickname || !req.user.picture) {
        res.status(400).send();
      }

      const file = req.file as any;

      const post = await Post.create({
        imageId: file.public_id,
        imageUrl: file.url,
        imageWidth: file.width,
        imageHeight: file.height,
        author: {
          id: req.user.sub,
          name: req.user.nickname,
          avatarUrl: req.user.picture
        },
        likes: [req.user.sub],
        likesCount: 1
      });

      res.status(201).json(serializePost(req.user)(post));
    } catch (error) {
      next(error);
    }
  }
);

app.delete("/api/posts/:id", requireAuth, async (req, res, next) => {
  try {
    const post = mongoose.Types.ObjectId.isValid(req.params.id)
      ? await Post.findOne({ _id: req.params.id })
      : null;

    if (post === null) {
      res.status(404).send();

      return;
    }

    if (req.user.sub !== post.author.id) {
      res.status(401).send();
    }

    await Promise.all([storage.delete(post.imageId), post.remove()]);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.put("/api/posts/:id/like", requireAuth, async (req, res, next) => {
  try {
    const { nModified } = await Post.updateOne(
      {
        _id: req.params.id,
        likes: { $ne: req.user.sub }
      },
      {
        $inc: {
          likesCount: 1
        },
        $push: {
          likes: req.user.sub
        }
      }
    ).exec();

    if (nModified === 0) {
      res.status(400).end();

      return;
    }

    res.status(202).end();
  } catch (error) {
    next(error);
  }
});

app.delete("/api/posts/:id/like", requireAuth, async (req, res, next) => {
  try {
    const { nModified } = await Post.updateOne(
      {
        _id: req.params.id,
        likes: req.user.sub
      },
      {
        $inc: {
          likesCount: -1
        },
        $pull: {
          likes: req.user.sub
        }
      }
    ).exec();

    if (nModified === 0) {
      res.status(400).end();

      return;
    }

    res.status(202).end();
  } catch (error) {
    next(error);
  }
});

app.use(((err, req, res, next) => {
  logger.error(err);

  res.status(500).json({
    message: err.message
  });
}) as express.ErrorRequestHandler);

export default app;
