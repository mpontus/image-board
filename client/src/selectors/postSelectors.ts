import { Selector, ParametricSelector, createSelector } from "reselect";
import { State } from "../reducers";
import { Post } from "../models";

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
    (instances, id) => {
      const recurse = (id: string): string =>
        id in instances ? recurse(instances[id]) : id;

      return recurse(id);
    }
  );

/**
 * Return the list IDs in the current listing
 *
 * Do not return final ids from this function to avoid remounting
 * pending posts after resolution.
 */
export const makeGetPostIds = (): Selector<
  State,
  ReadonlyArray<string>
> => state => [...state.posts.pendingIds, ...state.posts.ids];

/**
 * Retrieve the post by ID and denormalize it into domain model
 */
export const makeGetPostById = (): ParametricSelector<
  State,
  { id: string },
  Post | undefined
> => {
  const getFinalId = makeGetFinalId();

  return (state, { id }) => state.posts.byId[getFinalId(state, id)];
};
