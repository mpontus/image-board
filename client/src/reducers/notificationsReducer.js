import {
  DISMISS_NOTIFICATION,
  CREATE_POST_ERROR,
  DELETE_POST_ERROR,
  LIKE_POST_ERROR,
} from "../actions";

const initialState = null;

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISMISS_NOTIFICATION: {
      return initialState;
    }

    case CREATE_POST_ERROR: {
      return "Create post failed";
    }

    case DELETE_POST_ERROR: {
      return "Delete post failed";
    }

    case LIKE_POST_ERROR: {
      return "Failed to like the post";
    }

    default:
      return state;
  }
};

export default notificationsReducer;
