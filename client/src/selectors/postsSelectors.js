import { createSelector } from "reselect";

/**
 * Resolve Post's final id
 *
 * Posts are created instantly after submission with auto-generated
 * id. After saving the post to the database, that id is aliased with
 * the real id by which the entity returned from the API is saved into
 * redux store.
 */
const makeGetFinalId = () =>
  createSelector(
    state => state.posts.instances,
    (state, id) => id,
    (instances, id) => {
      const recurse = id => (id in instances ? recurse(instances[id]) : id);

      return recurse(id);
    }
  );

export const makeHasMorePosts = () =>
  createSelector(
    makeGetPostIds(),
    state => state.posts.total,
    (ids, total) => total > ids.length
  );

/**
 * Return the number of pages retrieved from the API so far.
 */
export const makeGetLastPage = () => state => state.posts.lastPage;

/**
 * Return the list IDs in the current listing
 */
// Why don't we return final ids from this function?
//
// Even though it would help us avoid performing ID resolution in
// makeGetPostById, the original key may be important for UX in the
// context of virtualized list.
export const makeGetPostIds = () => {
  const getFinalId = makeGetFinalId();

  return createSelector(
    state => state.posts.ids,
    state => state.posts.byId,
    state => state.posts.instances,
    (ids, byId, instances) =>
      ids.filter(id => {
        // Use OutputSelector#resultFunc to bypass, in this case,
        // harmful memoization since the key will be reset with each
        // iteration
        const finalId = getFinalId.resultFunc(instances, id);

        return !!byId[finalId];
      })
  );
};

/**
 * Retrieve the post by ID and denormalize it into domain model
 */
export const makeGetPostById = () => {
  const getFinalId = makeGetFinalId();
  const finalSelector = createSelector(
    (state, id) => state.posts.byId[id],
    (state, id) => state.posts.uncommitted[id],
    (state, id) => state.posts.progress[id],
    (post, uncommitted, progress) => ({
      ...post,
      committed: !uncommitted,
      progress: progress,
    })
  );

  return (state, { id }) => finalSelector(state, getFinalId(state, id));
};
