import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { configureStore } from "./store";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { loadPosts } from "./actions";

const api = axios.create({
  baseURL: "/api/"
});

const store = configureStore({ api });

store.dispatch(loadPosts());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
