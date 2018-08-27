import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Auth0Lock from "auth0-lock";
import axios from "axios";
import App from "./App";
import createStore from "./store";
import { AuthService } from "./services";
import { connectAxiosToAuth } from "./utils";
import registerServiceWorker from "./registerServiceWorker";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const auth = new AuthService(
  new Auth0Lock(
    process.env.REACT_APP_AUTH0_CLIENT_ID,
    process.env.REACT_APP_AUTH0_DOMAIN,
    {
      autoclose: true,
      auth: {
        redirect: false,
        responseType: "token id_token",
      },
    }
  ),
  localStorage
);

const store = createStore({ auth, api });

connectAxiosToAuth(api, auth);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
