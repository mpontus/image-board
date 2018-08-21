import { createSelector } from "reselect";

export const makeGetPostIds = () =>
  createSelector(
    state => state.posts.ids,
    state => state.posts.byId,
    (ids, byId) => ids.filter(id => !!byId[id])
  );

export const makeGetPostById = () =>
  createSelector(
    state => state.posts.byId,
    (state, query) => query.id,
    (byId, id) => byId[id]
  );
