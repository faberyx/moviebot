/** @jsx createElement */
import { createElement, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { ErrorBoundary } from '../Components/ErrorBoundary';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import orange from '@material-ui/core/colors/orange';
import blue from '@material-ui/core/colors/blue';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/core/styles';

const ForgotPasswordContainer = lazy(() => import('../Containers/Auth/ForgotPassword'));
const ResetPasswordContainer = lazy(() => import('../Containers/Auth/ResetPassword'));
const LogoutContainer = lazy(() => import('../Containers/Auth/Logout'));

const LoginContainer = lazy(() => import('../Containers/Auth/LoginContainer'));

const RegisterContainer = lazy(() => import('../Containers/Auth/RegisterContainer'));
const MovieBotContainer = lazy(() => import('../Containers/Bot/MovieBot'));

const ConfirmEmailContainer = lazy(() => import('../Containers/Auth/ConfirmEmail'));

function Routes() {
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            // Purple and green play nicely together.
            main: blue[500]
          },
          secondary: {
            // This is green.A700 as hex.
            main: orange[500]
          }
        }
      }),
    []
  );
  return (
    <Suspense fallback={<CircularProgress color="inherit" />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Router>
            <PrivateRoute exact={true} path="/" Component={MovieBotContainer} />
            <Route exact={true} path="/login" component={LoginContainer} />
            <Route exact={true} path="/logout" component={LogoutContainer} />
            <Route exact={true} path="/register" component={RegisterContainer} />
            <Route exact={true} path="/forgotpassword" component={ForgotPasswordContainer} />
            <Route exact={true} path="/resetpassword" component={ResetPasswordContainer} />
            <Route exact={true} path="/confirm" component={ConfirmEmailContainer} />
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Suspense>
  );
}

export default Routes;
