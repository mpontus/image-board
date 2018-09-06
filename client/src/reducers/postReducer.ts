import { Reducer } from "redux";
import {
  Action,
  CREATE_POST,
  CREATE_POST_REJECT,
  CREATE_POST_RESOLVE,
  LOAD_POSTS_RESOLVE
} from "../actions";
import { Post } from "../models";

export interface State {
  readonly loading: boolean;
  readonly total: number | null;
  readonly pendingIds: ReadonlyArray<string>;
  readonly ids: ReadonlyArray<string>;
  readonly byId: Readonly<{ [id: string]: Post | undefined }>;
  readonly instances: Readonly<{ [id: string]: string }>;
}

const initialState: State = {
  loading: false,
  total: null,
  pendingIds: [],
  ids: [],
  byId: {},
  instances: {}
};

const reducer: Reducer<State, Action> = (
  state = initialState,
  action: Action
) => {
  switch (action.type) {
    case LOAD_POSTS_RESOLVE: {
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
    }

    case CREATE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        pendingIds: [post.id, ...state.pendingIds],
        byId: {
          ...state.byId,
          [post.id]: post
        }
      };
    }

    case CREATE_POST_RESOLVE: {
      const { post, instance } = action.payload;

      return {
        ...state,
        pendingIds: state.pendingIds.filter(id => id !== post.id),
        ids: [post.id, ...state.ids],
        instances: {
          ...state.instances,
          [post.id]: instance.id
        },
        byId: {
          ...state.byId,
          [instance.id]: instance
        }
      };
    }

    case CREATE_POST_REJECT: {
      const { post } = action.payload;

      return {
        ...state,
        pendingIds: state.pendingIds.filter(id => id !== post.id),
        byId: {
          ...state.byId,
          [post.id]: undefined
        }
      };
    }

    default:
      return state;
  }
};

export default reducer;
