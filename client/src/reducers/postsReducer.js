import {
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  DELETE_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  LIKE_POST,
  LIKE_POST_SUCCESS,
  LIKE_POST_ERROR
} from "../actions";

const initialState = {
  ids: [],
  byId: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_SUCCESS: {
      const { posts, after } = action.payload;

      const ids = posts.map(post => post.id);

      return {
        ids: after ? [...state.ids, ...ids] : ids,
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
        ids: [post.id, ...state.ids],
        byId: {
          ...state.byId,
          [post.id]: post
        }
      };
    }

    case CREATE_POST_SUCCESS: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: {
            ...post,
            committed: true
          }
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
      const { post, error } = action.payload;

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
