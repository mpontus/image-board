import { createStore, applyMiddleware } from "redux";
// TODO: Log only in development
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";
import reducer from "./reducers";
import epic from "./epics";

const configureStore = deps => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: deps,
  });

  const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(epic);

  return store;
};

export default configureStore;
