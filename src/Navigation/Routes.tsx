/** @jsx createElement */
import { createElement, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { LoginContainer } from "../Containers/Auth/LoginContainer";
import { RegisterContainer } from "../Containers/Auth/RegisterContainer";
import { MovieBotContainer } from "../Containers/Bot/MovieBot";
import { ConfirmEmailContainer } from "../Containers/Auth/ConfirmEmail";

const Routes = () => {
  return (
    <Router>
      <Fragment>
        <PrivateRoute exact={true} path="/" component={MovieBotContainer} />
        <Route exact={true} path="/login" component={LoginContainer} />
        <Route exact={true} path="/register" component={RegisterContainer} />
        <Route exact={true} path="/confirm" component={ConfirmEmailContainer} />
      </Fragment>
    </Router>
  );
};

export default Routes;
