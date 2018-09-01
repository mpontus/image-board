import { Reducer } from "redux";
import { Action, LOAD_POSTS_RESOLVE } from "../actions";
import { Post } from "../models";

export interface State {
  readonly loading: boolean;
  readonly total: number | null;
  readonly ids: ReadonlyArray<string>;
  readonly byId: Readonly<{ [id: string]: Post }>;
}

const initialState: State = {
  loading: false,
  total: null,
  ids: [],
  byId: {}
};

const reducer: Reducer<State, Action> = (
  state = initialState,
  action: Action
) => {
  switch (action.type) {
    case LOAD_POSTS_RESOLVE:
      const { total, posts } = action.payload;

      return {
        ...state,
        total,
        loading: false,
        ids: posts.map(post => post.id),
        byId: posts.reduce(
          (acc, post) => ({
            ...acc,
            [post.id]: post
          }),
          {}
        )
      };

    default:
      return state;
  }
};

export default reducer;
