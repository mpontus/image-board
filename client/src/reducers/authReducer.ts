import { Reducer } from "redux";
import { set } from "object-immutable-set";
import { Action, AUTHENTICATED } from "../actions";

export interface State {
  idToken: string | null;
}

const initialState = {
  idToken: null,
};

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      const { idToken } = action.payload;

      return set(state, ["idToken"], idToken);

    default:
      return state;
  }
};

export default reducer;
