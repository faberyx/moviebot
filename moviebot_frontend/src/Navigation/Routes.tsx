/** @jsx createElement */
import { createElement, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

// LAZY IMPORT ROUTES
const ForgotPasswordContainer = lazy(() => import('../Containers/Auth/ForgotPassword'));
const ResetPasswordContainer = lazy(() => import('../Containers/Auth/ResetPassword'));
const LogoutContainer = lazy(() => import('../Containers/Auth/Logout'));
const LoginContainer = lazy(() => import('../Containers/Auth/LoginContainer'));
const RegisterContainer = lazy(() => import('../Containers/Auth/RegisterContainer'));
const MovieBotContainer = lazy(() => import('../Containers/Bot/MovieBot'));
const ConfirmEmailContainer = lazy(() => import('../Containers/Auth/ConfirmEmail'));

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/login" component={LoginContainer} />
        <Route exact={true} path="/logout" component={LogoutContainer} />
        <Route exact={true} path="/register" component={RegisterContainer} />
        <Route exact={true} path="/forgotpassword" component={ForgotPasswordContainer} />
        <Route exact={true} path="/resetpassword" component={ResetPasswordContainer} />
        <Route exact={true} path="/confirm" component={ConfirmEmailContainer} />
        <PrivateRoute exact={true} path={['/', '/watchlist', '/recommendations', '/help']} Component={MovieBotContainer} />
      </Switch>
    </Router>
  );
}

export default Routes;
