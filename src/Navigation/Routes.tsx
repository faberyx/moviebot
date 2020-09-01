/** @jsx createElement */
import { createElement, useMemo } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { LoginContainer } from "../Containers/Auth/LoginContainer";
import { RegisterContainer } from "../Containers/Auth/RegisterContainer";
import { MovieBotContainer } from "../Containers/Bot/MovieBot";
import { ConfirmEmailContainer } from "../Containers/Auth/ConfirmEmail";
import { ErrorBoundary } from "../Components/ErrorBoundary";
import { CssBaseline } from "@material-ui/core";
import { orange, blue } from "@material-ui/core/colors";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { ForgotPasswordContainer } from "../Containers/Auth/ForgotPassword";
import { ResetPasswordContainer } from "../Containers/Auth/ResetPassword";
import { LogoutContainer } from "../Containers/Auth/Logout";

function Routes() {
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            // Purple and green play nicely together.
            main: blue[500],
          },
          secondary: {
            // This is green.A700 as hex.
            main: orange[500],
          },
        },
      }),
    []
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <PrivateRoute exact={true} path="/" Component={MovieBotContainer} />
          <Route exact={true} path="/login" component={LoginContainer} />
          <Route exact={true} path="/logout" component={LogoutContainer} />
          <Route exact={true} path="/register" component={RegisterContainer} />
          <Route
            exact={true}
            path="/forgotpassword"
            component={ForgotPasswordContainer}
          />
          <Route
            exact={true}
            path="/resetpassword"
            component={ResetPasswordContainer}
          />
          <Route
            exact={true}
            path="/confirm"
            component={ConfirmEmailContainer}
          />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default Routes;
