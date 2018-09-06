import { Selector, createSelector } from "reselect";
import { State } from "../reducers";
import { Post } from "../models";

export const makeGetPostIds = (): Selector<
  State,
  ReadonlyArray<string>
> => state => state.posts.ids;

export const makeGetPostById = () =>
  createSelector<
    State,
    { id: string },
    string,
    { [id: string]: Post | undefined },
    Post | undefined
  >(
    (_, ownProps) => ownProps.id,
    state => state.posts.byId,
    (id, byId) => byId[id]
  );
