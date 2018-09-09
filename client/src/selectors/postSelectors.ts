import { createSelector, ParametricSelector, Selector } from "reselect";
import { denormalizePost, Post } from "../models";
import { State } from "../reducers";

const getFinalIdRecursively = (
  instances: { [key: string]: string },
  id: string
) => (id in instances ? instances[id] : id);

/**
 * Resolve Post's final id
 *
 * Posts are created instantly after submission with auto-generated
 * id. After saving the post to the database, that id is aliased with
 * the real id by which the entity returned from the API is saved into
 * redux store.
 */
const makeGetFinalId = (): ParametricSelector<State, string, string> =>
  createSelector(
    state => state.posts.instances,
    (state: State, id: string) => id,
    getFinalIdRecursively
  );

/**
 * Return the list IDs in the current listing
 *
 * Do not return final ids from this function to avoid remounting
 * pending posts after resolution.
 */
export const makeGetPostIds = (): Selector<State, string[]> =>
  createSelector(
    state => state.posts.pendingIds,
    state => state.posts.ids,
    state => state.posts.byId,
    state => state.posts.isDeletedById,
    state => state.posts.instances,
    (pending, ids, byId, isDeletedById, instances) =>
      [...pending, ...ids].filter(id => !isDeletedById[id]).filter(id => {
        // Use resultFunc to bypass, in this case, harmful memoization
        // since the key will be reset with each iteration
        const finalId = getFinalIdRecursively(instances, id);

        return !!byId[finalId];
      })
  );

/**
 * Retrieve the post by ID and denormalize it into domain model
 */
export const makeGetPostById = (): ParametricSelector<
  State,
  { id: string },
  Post | undefined
> => {
  const getFinalId = makeGetFinalId();
  const finalSelector: ParametricSelector<
    State,
    string,
    Post | undefined
  > = createSelector(
    (state: State, id: string) => state.posts.byId[id],
    (state: State, id: string) => state.posts.isPendingById[id],
    (state: State, id: string) => state.posts.progress[id],
    (post, pending, progress) =>
      post ? denormalizePost(post, pending || false, progress) : undefined
  );

  return (state, { id }) => {
    return finalSelector(state, getFinalId(state, id));
  };
};
