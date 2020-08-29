/** @jsx createElement */
import { createElement, FC, useEffect } from "react";
import { Route, Redirect, RouteComponentProps } from "react-router-dom";

/** Helpers */
import { validateToken } from "../Utils/validation";

/** Constants */
import { AuthKey } from "../Utils/constants";

type Props = {
  Component: FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
};

export const PrivateRoute = ({
  Component,
  path,
  exact = false,
}: Props): JSX.Element => {
  const isAuthed = validateToken(localStorage.getItem(AuthKey));
  console.log("IS AUTH>>", isAuthed);
  useEffect(() => {
    const isAuthed = validateToken(localStorage.getItem(AuthKey));
    console.log("PrivateRoute MOUNT", isAuthed, Component, path);
  });
  return (
    <Route
      exact={exact}
      path={path}
      render={(props: RouteComponentProps) =>
        isAuthed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
};
