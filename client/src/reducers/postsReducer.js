import {
  FETCH_POSTS_SUCCESS,
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  LIKE_POST,
  LIKE_POST_ERROR
} from "../actions";

const initialState = {
  ids: [],
  byId: {},
  uncommitted: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_SUCCESS: {
      const { posts, offset } = action.payload;

      const ids = posts.map(post => post.id);

      return {
        ...state,
        ids: offset > 0 ? [...state.ids, ...ids] : ids,
        byId: {
          ...state.posts,
          ...posts.reduce(
            (posts, post) => ({
              ...posts,
              [post.id]: post
            }),
            {}
          )
        }
      };
    }

    case CREATE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        ids: [post.id, ...state.ids],
        byId: {
          ...state.byId,
          [post.id]: post
        },
        uncommitted: {
          ...state.uncommitted,
          [post.id]: true
        }
      };
    }

    case CREATE_POST_SUCCESS: {
      const { post, committedPost } = action.payload;

      return {
        ...state,
        ids: state.ids.map(id => (id === post.id ? committedPost.id : id)),
        byId: {
          ...state.byId,
          [post.id]: undefined,
          [committedPost.id]: committedPost
        }
      };
    }

    case CREATE_POST_ERROR: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: null
        }
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
            likes: state.byId[post.id].likes + value
          }
        }
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
            likes: state.byId[post.id].likes - value
          }
        }
      };
    }

    case DELETE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: null
        }
      };
    }

    case DELETE_POST_SUCCESS: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: null
        }
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
            error: action.payload
          }
        }
      };
    }

    default:
      return state;
  }
};
