import * as t from "io-ts";
import { PageResponseSchema, PostSchema } from "./schema";

export interface Post extends t.TypeOf<typeof PostSchema> {
  _api: void;
}

export type PageResponse = t.TypeOf<typeof PageResponseSchema>;
