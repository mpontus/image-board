import { AxiosInstance } from "axios";
import { applyMiddleware, createStore } from "redux";
import { EpicMiddleware, createEpicMiddleware } from "redux-observable";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxLogger from "redux-logger";
import { Action } from "../actions";
import epics from "../epics";
import reducers, { State } from "../reducers";
import { AuthService } from "../services";

export interface Dependencies {
  api: AxiosInstance;
  auth: AuthService;
}

const configureStore = (dependencies: Dependencies) => {
  const epicMiddleware: EpicMiddleware<
    Action,
    Action,
    State,
    Dependencies
    > = createEpicMiddleware({
      dependencies
    });

  const store = createStore(
    reducers,
    composeWithDevTools(
      applyMiddleware(reduxPromise, epicMiddleware, reduxLogger)
    )
  );

  epicMiddleware.run(epics);

  return store;
};

export default configureStore;
