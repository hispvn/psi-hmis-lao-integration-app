import React from 'react';
import ReactDOM from 'react-dom';
import App from "./component/App";
import initHeaderBar from 'd2-ui/lib/app-header';
import { baseUrl } from "./config.json";

initHeaderBar(document.getElementById('header-bar'), baseUrl + "/api")
    .catch(err => {
        console.warn(err);
    });


const app = document.getElementById("app");

ReactDOM.render(<App />, app);