import nanoid from "nanoid";

export const FETCH_POSTS = "FETCH_POSTS";
export const FETCH_POSTS_SUCCESS = "FETCH_POSTS_SUCCESS";
export const FETCH_POSTS_ERROR = "FETCH_POSTS_ERROR";
export const CREATE_POST = "CREATE_POST";
export const CREATE_POST_SUCCESS = "CREATE_POST_SUCCESS";
export const CREATE_POST_ERROR = "CREATE_POST_ERROR";
export const LIKE_POST = "LIKE_POST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_ERROR = "LIKE_POST_ERROR";
export const DELETE_POST = "DELETE_POST";
export const DELETE_POST_SUCCESS = "DELETE_POST_SUCCESS";
export const DELETE_POST_ERROR = "DELETE_POST_ERROR";
export const UPLOAD_PROGRESS = "UPLOAD_PROGRESS";
export const END_REACHED = "END_REACHED";

export const fetchPosts = () => ({
  type: FETCH_POSTS,
});

export const fetchPostsSuccess = ({ items, total, page }) => ({
  type: FETCH_POSTS_SUCCESS,
  payload: {
    page,
    total,
    posts: items,
  },
});

export const fetchPostsError = (page, error) => ({
  type: FETCH_POSTS_ERROR,
  payload: {
    error,
    page,
  },
});

/**
 * Create post with the given image file
 *
 * We need to provide data url separately from the file for the action to be created syncrhonously.
 */
// TODO: Encapsulate dataUrl, width and height as value object
export const createPost = (file, dataUrl, width, height, user) => ({
  type: CREATE_POST,
  payload: {
    file,
    post: {
      id: `temp/${nanoid()}`,
      imageUrl: dataUrl,
      imageWidth: width,
      imageHeight: height,
      author: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatar,
      },
      isLiked: true,
      likes: 1,
      committed: false,
    },
  },
});

export const createPostSuccess = (post, committedPost) => ({
  type: CREATE_POST_SUCCESS,
  payload: {
    post,
    committedPost,
  },
});

export const createPostError = (post, error) => ({
  type: CREATE_POST_ERROR,
  payload: {
    post,
    error,
  },
});

export const likePost = (post, value) => ({
  type: LIKE_POST,
  payload: {
    post,
    value,
  },
});

export const likePostSuccess = (post, value) => ({
  type: LIKE_POST_SUCCESS,
  payload: {
    post,
    value,
  },
});

export const likePostError = (post, value, error) => ({
  type: LIKE_POST_ERROR,
  payload: {
    post,
    value,
    error,
  },
});

export const deletePost = post => ({
  type: DELETE_POST,
  payload: {
    post,
  },
});

export const deletePostSuccess = post => ({
  type: DELETE_POST_SUCCESS,
  payload: {
    post,
  },
});

export const deletePostError = (post, error) => ({
  type: DELETE_POST_ERROR,
  payload: {
    post,
    error,
  },
});

export const uploadProgress = (id, bytesTransferred, totalBytes) => ({
  type: UPLOAD_PROGRESS,
  payload: {
    id,
    bytesTransferred,
    totalBytes,
  },
});

export const endReached = lastPage => ({
  type: END_REACHED,
  payload: {
    lastPage,
  },
});
