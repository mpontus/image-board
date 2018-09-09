import * as faker from "faker";
import { PostData } from "../models";

export const post = (): PostData => ({
  id: faker.random.uuid(),
  picture: {
    url: faker.image.imageUrl(),
    width: faker.random.number(),
    height: faker.random.number()
  },
  author: {
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    avatarUrl: faker.internet.avatar()
  },
  likesCount: faker.random.number(),
  isLiked: faker.random.boolean(),
  timestamp: faker.date.past().getTime()
});
