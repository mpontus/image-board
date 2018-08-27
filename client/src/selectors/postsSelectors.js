import { createSelector } from "reselect";

/**
 * Resolve Post's final id
 *
 * Posts are created instantly after submission with auto-generated
 * id. After saving the post to the database, that id is aliased with
 * the real id by which the entity returned from the API is saved into
 * redux store.
 */
const getFinalId = (instances, id) =>
  id in instances ? getFinalId(instances, instances[id]) : id;

/**
 * Check whether the entity refernced by ID exists.
 *
 * Removing entity from the store is cheaper by resetting its value in
 * the map rather than splicing the id list.
 */
const entityExists = (byId, id) => !!byId[id];

/**
 * Denormalize post
 *
 * Post model includes such values as its upload progress, whether the
 * entity only exists locally or saved in the database, and any errors
 * that occur while persisting the entity.
 *
 * In the redux store those values are stored separately from Post
 * representation as returned by the API.
 *
 * We need to build fully qualified local model before the entity can
 * be used in the components.
 */
const denormalizeEntity = (byId, uncommitted, id) => ({
  ...byId[id],
  committed: !uncommitted[id],
});

// TODO: After removing post the ids length may be greater than total
// due to not splicing the id list. We need to store the count of
// deleted posts separately to account for that.
export const makeHasMorePosts = () =>
  createSelector(
    state => state.posts.ids.length,
    state => state.posts.total,
    (count, total) => (total == null ? true : total > count)
  );

/**
 * Return the number of pages retrieved from the API so far.
 */
export const makeGetLastPage = () => state => state.posts.lastPage;

export const makeGetPostIds = () =>
  createSelector(
    state => state.posts.ids,
    state => state.posts.byId,
    state => state.posts.instances,
    (ids, byId, instances) => {
      return ids.filter(id => entityExists(byId, getFinalId(instances, id)));
    }
  );

export const makeGetPostById = () =>
  createSelector(
    (_, query) => query.id,
    state => state.posts.byId,
    state => state.posts.uncommitted,
    state => state.posts.instances,
    (id, byId, uncommitted, instances) =>
      denormalizeEntity(byId, uncommitted, getFinalId(instances, id))
  );
