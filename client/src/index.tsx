import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import configureStore from "./configureStore";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

const api = axios.create({
  baseURL: "/api/"
});

const store = configureStore({ api });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
