import { DISMISS_NOTIFICATION, LIKE_POST_ERROR } from "../actions";

const initialState = null;

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DISMISS_NOTIFICATION: {
      return initialState;
    }

    case LIKE_POST_ERROR: {
      return "Failed to like the post";
    }

    default:
      return state;
  }
};

export default notificationsReducer;
