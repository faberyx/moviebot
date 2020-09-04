/** @jsx createElement */
import { createElement, memo, FC, useEffect, useState, Fragment } from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';

type Props = {
  Component: FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
};

export const PrivateRouteComponent = ({ Component, path, exact = false }: Props): JSX.Element => {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  useEffect(() => {
    Auth.currentSession()
      .then((data) => {
        console.log('COGNITO', data);
        setLoggedIn(true);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <Fragment>
      {isLoggedIn !== null && (
        <Route
          exact={exact}
          path={path}
          render={(props: RouteComponentProps) =>
            isLoggedIn ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/login'
                }}
              />
            )
          }
        />
      )}
    </Fragment>
  );
};

export const PrivateRoute = memo(PrivateRouteComponent);
