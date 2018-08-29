import {
  FETCH_POSTS_SUCCESS,
  CREATE_POST,
  UPLOAD_PROGRESS,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  LIKE_POST,
  LIKE_POST_ERROR,
} from "../actions";

const initialState = {
  total: null,
  lastPage: null,
  ids: [],
  pending: [],
  byId: {},
  instances: {},
  uncommitted: {},
  progress: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_SUCCESS: {
      const { total, posts, page } = action.payload;

      const ids = posts.map(post => post.id);

      return {
        ...state,
        total,
        lastPage: page,
        ids: page > 1 ? [...state.ids, ...ids] : ids,
        byId: {
          ...state.byId,
          ...posts.reduce(
            (posts, post) => ({
              ...posts,
              [post.id]: post,
            }),
            {}
          ),
        },
      };
    }

    case CREATE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        pending: [post.id, ...state.pending],
        byId: {
          ...state.byId,
          [post.id]: post,
        },
        uncommitted: {
          ...state.uncommitted,
          [post.id]: true,
        },
      };
    }

    case UPLOAD_PROGRESS: {
      const { id, bytesTransferred, bytesTotal } = action.payload;

      return {
        ...state,
        progress: {
          ...state.uploadProgress,
          [id]: {
            bytesTransferred,
            bytesTotal,
          },
        },
      };
    }

    case CREATE_POST_SUCCESS: {
      const { post, committedPost } = action.payload;

      return {
        ...state,
        pending: state.pending.filter(id => id !== post.id),
        ids: [post.id, ...state.ids],
        instances: {
          ...state.instances,
          [post.id]: committedPost.id,
        },
        byId: {
          ...state.byId,
          [post.id]: undefined,
          [committedPost.id]: committedPost,
        },
        uncommitted: {
          ...state.uncommitted,
          [post.id]: false,
        },
      };
    }

    case CREATE_POST_ERROR: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: null,
        },
      };
    }

    case LIKE_POST: {
      const { post, value } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: {
            ...state.byId[post.id],
            isLiked: value > 0,
            likes: state.byId[post.id].likes + value,
          },
        },
      };
    }

    case LIKE_POST_ERROR: {
      const { post, value } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: {
            ...state.byId[post.id],
            isLiked: !(value > 0),
            likes: state.byId[post.id].likes - value,
          },
        },
      };
    }

    case DELETE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: null,
        },
      };
    }

    case DELETE_POST_SUCCESS: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: null,
        },
      };
    }

    case DELETE_POST_ERROR: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: {
            ...post,
            error: action.payload,
          },
        },
      };
    }

    default:
      return state;
  }
};
