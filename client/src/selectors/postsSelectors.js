import { createSelector } from 'reselect';

export const makeGetPostIds = () => state => state.posts.ids;

export const makeGetPostById = () => createSelector(
  state => state.posts.byId,
  (state, query) => query.id,
  (byId, id) => byId[id],
);
