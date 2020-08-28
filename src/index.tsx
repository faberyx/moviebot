/** @jsx createElement */
import { createElement, Fragment } from "react";
import { render } from "react-dom";
import Amplify from "aws-amplify";
import { CssBaseline } from "@material-ui/core";
import "./global.css";

/** Amplify config */
import awsconfig from "./aws-exports";

import Routes from "./Navigation/Routes";

/** Service worker */
import * as serviceWorker from "./serviceWorker";

/** Configure amplify */
Amplify.configure(awsconfig);

render(
  <Fragment>
    <CssBaseline />
    <Routes />
  </Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
