import auth0Lock from "auth0-lock";
import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { loadPosts } from "./actions";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { AuthService } from "./services";
import { configureStore } from "./store";

const api = axios.create({
  baseURL: "/api/"
});

const auth = new AuthService({
  lock: new auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID || "",
    process.env.REACT_APP_AUTH0_DOMAIN || "",
    {
      autoclose: true,
      auth: {
        redirect: false,
        responseType: "token id_token"
      }
    }
  )
});

const store = configureStore({ api, auth });

store.dispatch(loadPosts());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
