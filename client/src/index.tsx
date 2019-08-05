import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "react-table/react-table.css";
import { App } from "./app";
import configureStore from "./common/store";
import * as serviceWorker from "./serviceWorker";

axios.defaults.withCredentials = true;
axios.defaults.headers = { Pragma: "no-cache" };

const store = configureStore({});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
