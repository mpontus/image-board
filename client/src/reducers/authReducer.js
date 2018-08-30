import { AUTHENTICATED } from "../actions";

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED: {
      const { idToken } = action.payload;

      return {
        token: idToken,
      };
    }

    default: {
      return state;
    }
  }
};
