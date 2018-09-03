/* tslint:disable variable-name */

import * as t from "io-ts";

export const PostSchema = t.type({
  id: t.string,
  picture: t.type({
    url: t.string,
    width: t.number,
    height: t.number
  }),
  author: t.type({
    id: t.string,
    name: t.string,
    avatarUrl: t.string
  }),
  likesCount: t.number,
  isLiked: t.boolean,
  timestamp: t.number
});

export const PageResponseSchema = t.type({
  total: t.number,
  items: t.array(PostSchema)
});
