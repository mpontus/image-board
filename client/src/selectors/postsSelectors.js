import { createSelector } from "reselect";

export const makeGetPostIds = () =>
  createSelector(
    state => state.posts.ids,
    state => state.posts.byId,
    (ids, byId) => ids.filter(id => !!byId[id])
  );

export const makeGetPostById = () =>
  createSelector(
    (state, query) => query.id,
    state => state.posts.byId,
    state => state.posts.uncommitted,
    (id, byId, uncommitted) => ({
      ...byId[id],
      committed: !uncommitted[id]
    })
  );
