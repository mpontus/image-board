import { AxiosInstance } from "axios";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createEpicMiddleware } from "redux-observable";
import rootEpic from "../epics";
import reducer from "../reducers";

interface IDependencies {
  api: AxiosInstance;
}

const configureStore = ({ api }: IDependencies) => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      api
    }
  });

  const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);

  return store;
};

export default configureStore;
