/** @jsx createElement */
import { createElement } from "react";
import { Route, Redirect } from "react-router-dom";

/** Helpers */
import { validateToken } from "../Utils/validation";

/** Constants */
import { AuthKey } from "../Utils/constants";

export const PrivateRoute = ({
  component: Component,
  ...rest
}: any & { component: any }) => {
  const checkUserAuth = validateToken(localStorage.getItem(AuthKey));

  return (
    <Route
      {...rest}
      render={(props: JSX.IntrinsicAttributes) => {
        return checkUserAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        );
      }}
    />
  );
};
