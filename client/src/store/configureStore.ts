import { AxiosInstance } from "axios";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxLogger from "redux-logger";
import { EpicMiddleware, createEpicMiddleware } from "redux-observable";
import { Action } from "../actions";
import epics from "../epics";
import reducers, { State } from "../reducers";

export interface Dependencies {
  api: AxiosInstance;
}

const configureStore = ({ api }: Dependencies) => {
  const epicMiddleware: EpicMiddleware<
    Action,
    Action,
    State,
    Dependencies
    > = createEpicMiddleware({
      dependencies: {
        api
      }
    });

  const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(epicMiddleware, reduxLogger))
  );

  epicMiddleware.run(epics);

  return store;
};

export default configureStore;
