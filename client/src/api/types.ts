import * as t from "io-ts";
import { PageResponseSchema, PostSchema } from "./schema";

export type Post = t.TypeOf<typeof PostSchema>;
export type PageResponse = t.TypeOf<typeof PageResponseSchema>;
