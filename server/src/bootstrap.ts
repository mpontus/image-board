import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { Mongoose } from "mongoose";
import { AuthProvider } from "./auth/AuthProvider";
import "./controllers/PostsController";
import { Auth0Service } from "./data/auth/Auth0Service";
import { MongoosePostRepository } from "./data/post/MongoosePostRepository";
import { CreatePost } from "./domain/interactor/CreatePost";
import { DeletePost } from "./domain/interactor/DeletePost";
import { GetPosts } from "./domain/interactor/GetPosts";
import { UpdatePostLikes } from "./domain/interactor/UpdatePostLikes";
import { AuthService } from "./domain/service/AuthService";
import { PostRepository } from "./domain/service/PostRepository";
import { Types } from "./domain/Types";

const bootstrap = () => {
  const mongoose = new Mongoose();
  const container = new Container();

  mongoose.connect(process.env.MONGODB_URI || "");

  container.bind<AuthService>(Types.AuthService).toConstantValue(
    new Auth0Service(
      {
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
      },
      {
        audience: process.env.AUTH0_CLIENT_ID,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"]
      }
    )
  );
  container.bind<Mongoose>(Types.Mongoose).toConstantValue(mongoose);
  container
    .bind<PostRepository>(Types.PostRepository)
    .to(MongoosePostRepository);
  container.bind<GetPosts>(Types.GetPosts).to(GetPosts);
  container.bind<CreatePost>(Types.CreatePost).to(CreatePost);
  container.bind<DeletePost>(Types.DeletePost).to(DeletePost);
  container.bind<UpdatePostLikes>(Types.UpdatePostLikes).to(UpdatePostLikes);

  const server = new InversifyExpressServer(
    container,
    null,
    null,
    null,
    AuthProvider
  );
  return server.build();
};

export default bootstrap;
