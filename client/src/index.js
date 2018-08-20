import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import App from "./App";

import registerServiceWorker from "./registerServiceWorker";

console.log({ baseurl: process.env.REACT_APP_API_URL });
console.log(process.env);

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

client.get("posts").then(console.log);

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
