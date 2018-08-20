import { AUTHENTICATED, LOGOUT } from "../actions";

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED: {
      const idToken = action.payload;

      return {
        token: idToken
      };
    }

    case LOGOUT: {
      return null;
    }

    default: {
      return state;
    }
  }
};
