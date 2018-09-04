import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { configureStore } from "./store";
import registerServiceWorker from "./registerServiceWorker";
import { loadPosts } from "./actions";
import { AuthService } from "./services";

const api = axios.create({
  baseURL: "/api/"
});

const auth = new AuthService({
  lock: new Auth0Lock(
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
