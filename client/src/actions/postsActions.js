import nanoid from "nanoid";

export const FETCH_POSTS = "FETCH_POSTS";
export const FETCH_POSTS_RESULT = "FETCH_POSTS_RESULT";
export const CREATE_POST = "CREATE_POST";
export const CREATE_POST_RESULT = "CREATE_POST_RESULT";
export const LIKE_POST = "LIKE_POST";
export const LIKE_POST_RESULT = "LIKE_POST_RESULT";
export const DELETE_POST = "DELETE_POST";
export const DELETE_POST_RESULT = "DELETE_POST_RESULT";
export const UPLOAD_PROGRESS = "UPLOAD_PROGRESS";

const withErrorVariant = (actionType, actionCreator) => (...payload) => {
  if (payload[0] instanceof Error) {
    return {
      type: actionType,
      payload
    };
  }

  return actionCreator(...payload);
};

export const fetchPosts = () => ({
  type: FETCH_POSTS
});

export const fetchPostsResult = ({ posts, total }) => ({
  type: FETCH_POSTS_RESULT,
  payload: {
    total,
    posts: posts.map(post => ({
      ...post,
      committed: true
    }))
  }
});

/**
 * Create post with the given image file
 *
 * We need to provide data url separately from the file for the action to be created syncrhonously.
 */

export const createPost = (file, dataUrl, user) => ({
  type: CREATE_POST,
  payload: {
    file,
    post: {
      id: `temp/${nanoid()}`,
      imageUrl: dataUrl,
      author: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatar
      },
      isLiked: true,
      likes: 1,
      committed: false
    }
  }
});

export const createPostResult = withErrorVariant(CREATE_POST_RESULT, post => ({
  type: CREATE_POST_RESULT,
  payload: {
    post
  }
}));

export const likePost = (post, value) => ({
  type: LIKE_POST,
  payload: {
    post,
    value
  }
});

export const likePostResult = withErrorVariant(
  LIKE_POST_RESULT,
  (post, value) => ({
    type: LIKE_POST_RESULT,
    payload: {
      post,
      value
    }
  })
);

export const deletePost = post => ({
  type: DELETE_POST,
  payload: {
    post
  }
});

export const deletePostResult = withErrorVariant(DELETE_POST_RESULT, post => ({
  type: DELETE_POST_RESULT,
  payload: {
    post
  }
}));

export const uploadProgress = (id, bytesTransferred, totalBytes) => ({
  type: UPLOAD_PROGRESS,
  payload: {
    id,
    bytesTransferred,
    totalBytes
  }
});
