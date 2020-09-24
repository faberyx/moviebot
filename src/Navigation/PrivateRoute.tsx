/** @jsx createElement */
import { createElement, memo, FC, useEffect, useState, Fragment } from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { Auth } from 'aws-amplify';

type Props = {
  Component: FC<RouteComponentProps>;
  path?: string | string[];
  exact?: boolean;
};

export const PrivateRouteComponent = ({ Component, path, exact = false }: Props): JSX.Element => {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  useEffect(() => {
    console.log('MOUNT > PRIVATE ROUTE');
    Auth.currentSession()
      .then((data) => {
        console.log(data.isValid());
        setLoggedIn(true);
      })
      .catch((err) => setLoggedIn(false));
  }, [path]);
  return (
    <Fragment>
      {isLoggedIn === true ? (
        <Route exact={exact} path={path} render={(props: RouteComponentProps) => <Component {...props} />} />
      ) : (
        isLoggedIn === false && (
          <Redirect
            to={{
              pathname: '/login'
            }}
          />
        )
      )}
    </Fragment>
  );
};

export const PrivateRoute = memo(PrivateRouteComponent);
