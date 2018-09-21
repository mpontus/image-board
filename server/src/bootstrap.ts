import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { Mongoose } from "mongoose";

import "./controllers/PostsController";
import { MongoosePostRepository } from "./data/post/MongoosePostRepository";
import { CreatePost } from "./domain/interactor/CreatePost";
import { DeletePost } from "./domain/interactor/DeletePost";
import { GetPosts } from "./domain/interactor/GetPosts";
import { UpdatePostLikes } from "./domain/interactor/UpdatePostLikes";
import { PostRepository } from "./domain/service/PostRepository";
import { Types } from "./domain/Types";

const bootstrap = () => {
  const mongoose = new Mongoose();
  const container = new Container();

  mongoose.connect(process.env.MONGODB_URI || "");

  container.bind<Mongoose>(Types.Mongoose).toConstantValue(mongoose);
  container
    .bind<PostRepository>(Types.PostRepository)
    .to(MongoosePostRepository);
  container.bind<GetPosts>(Types.GetPosts).to(GetPosts);
  container.bind<CreatePost>(Types.CreatePost).to(CreatePost);
  container.bind<DeletePost>(Types.DeletePost).to(DeletePost);
  container.bind<UpdatePostLikes>(Types.UpdatePostLikes).to(UpdatePostLikes);

  const server = new InversifyExpressServer(container);
  return server.build();
};

export default bootstrap;
