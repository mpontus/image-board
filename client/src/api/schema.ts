import * as t from "io-ts";

const DateFromISOString = new t.Type<Date, string>(
  "DateFromString",
  (m): m is Date => m instanceof Date,
  (m, c) =>
    t.string.validate(m, c).chain(s => {
      const d = new Date(s);

      return isNaN(d.getTime()) ? t.failure(s, c) : t.success(d);
    }),
  a => a.toISOString()
);

export const PostSchema = t.type({
  id: t.string,
  author: t.type({
    id: t.string,
    name: t.string,
    avatarUrl: t.string
  }),
  imageUrl: t.string,
  imageWidth: t.number,
  imageHeight: t.number,
  isLiked: t.boolean,
  likes: t.number,
  timestamp: DateFromISOString
});

export const PageResponseSchema = t.type({
  total: t.number,
  items: t.array(PostSchema)
});
