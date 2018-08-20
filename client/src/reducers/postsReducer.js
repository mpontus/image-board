import {
  FETCH_POSTS_RESULT,
  CREATE_POST,
  CREATE_POST_RESULT,
  DELETE_POST,
  DELETE_POST_RESULT,
  LIKE_POST,
  LIKE_POST_RESULT
} from "../actions";

const createPost = (id, dataUrl, user) => ({
  id,
  imageUrl: dataUrl,
  author: {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatar
  },
  isLiked: true,
  likes: 1,
  committed: false
});

const createPostFromResponse = response => ({
  ...response,
  committed: true
});

const initialState = {
  ids: [],
  byId: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_RESULT: {
      if (action.error) {
        return state;
      }

      const { posts, after } = action.payload;

      const ids = posts.map(post => post.id);

      return {
        ids: after ? [...state.ids, ...ids] : ids,
        posts: {
          ...state.posts,
          ...posts.reduce(
            (posts, post) => ({
              ...posts,
              [post.id]: createPostFromResponse(post)
            }),
            {}
          )
        }
      };
    }

    case CREATE_POST: {
      const { id, dataUrl, user } = action.payload;

      return {
        ids: [id, ...state.ids],
        byId: {
          ...state.byId,
          [id]: createPost(id, dataUrl, user)
        }
      };
    }

    case CREATE_POST_RESULT: {
      if (action.error) {
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

    case LIKE_POST: {
      const { post, value } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: {
            ...post,
            isLiked: value > 0,
            likes: post.likes + value
          }
        }
      };
    }

    case LIKE_POST_RESULT: {
      if (action.error) {
        const { post, value } = action.payload;

        return {
          ...state,
          byId: {
            ...state.byId,
            [post.id]: {
              isLiked: !(value > 0),
              likes: post.likes - value
            }
          }
        };
      }

      return state;
    }

    case DELETE_POST: {
      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: post.committed
            ? {
                ...post,
                deleted: true
              }
            : null
        }
      };
    }

    case DELETE_POST_RESULT: {
      if (action.error) {
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

      const { post } = action.payload;

      return {
        ...state,
        byId: {
          ...state.byId,
          [post.id]: null
        }
      };
    }

    default:
      return state;
  }
};
