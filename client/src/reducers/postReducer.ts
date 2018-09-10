import { Reducer } from "redux";
import {
  Action,
  CREATE_POST,
  CREATE_POST_REJECT,
  CREATE_POST_RESOLVE,
  DELETE_POST,
  DELETE_POST_REJECT,
  DELETE_POST_RESOLVE,
  LIKE_POST,
  LIKE_POST_REJECT,
  LOAD_POSTS_RESOLVE
} from "../actions";
import { PostData, Progress } from "../models";

export interface State {
  readonly loading: boolean;
  readonly lastPage: number | null;
  readonly total: number | null;
  readonly ids: ReadonlyArray<string>;
  readonly byId: Readonly<{ [id: string]: PostData | undefined }>;
  readonly pendingIds: ReadonlyArray<string>;
  readonly isPendingById: Readonly<{ [id: string]: boolean }>;
  readonly isDeletedById: Readonly<{ [id: string]: boolean }>;
  readonly instances: Readonly<{ [id: string]: string }>;
  readonly progress: Readonly<{ [id: string]: Progress }>;
}

const initialState: State = {
  loading: true,
  lastPage: null,
  total: null,
  ids: [],
  byId: {},
  pendingIds: [],
  isPendingById: {},
  isDeletedById: {},
  instances: {},
  progress: {}
};

const reducer: Reducer<State, Action> = (
  state = initialState,
  action: Action
) => {
  switch (action.type) {
    case LOAD_POSTS_RESOLVE: {
      const { page, total, posts } = action.payload;

      return {
        ...state,
        loading: false,
        lastPage: page,
        total,
        ids: state.ids.concat(posts.map(post => post.id)),
        byId: posts.reduce(
          (acc, post) => ({
            ...acc,
            [post.id]: post
          }),
          state.byId
        )
      };
    }

    case CREATE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        pendingIds: [post.id, ...state.pendingIds],
        isPendingById: {
          ...state.isPendingById,
          [post.id]: true
        },
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

    case DELETE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        isDeletedById: {
          ...state.isDeletedById,
          [post.id]: true
        }
      };
    }

    case DELETE_POST_RESOLVE: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: undefined
        }
      };
    }

    case DELETE_POST_REJECT: {
      const { post } = action.payload;

      return {
        ...state,
        isDeletedById: {
          ...state.isDeletedById,
          [post.id]: false
        }
      };
    }

    case LIKE_POST: {
      const { post, value } = action.payload;
      const current = state.byId[post.id];

      if (!current) {
        return state;
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: {
            ...current,
            isLiked: value > 0,
            likesCount: current.likesCount + value
          }
        }
      };
    }

    case LIKE_POST_REJECT: {
      const { post, value } = action.payload;
      const current = state.byId[post.id];

      if (!current) {
        return state;
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: {
            ...current,
            isLiked: !(value > 0),
            likesCount: current.likesCount - value
          }
        }
      };
    }

    default:
      return state;
  }
};

export default reducer;
