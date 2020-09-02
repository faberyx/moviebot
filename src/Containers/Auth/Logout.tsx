/** @jsx createElement */
import { createElement, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { Auth } from 'aws-amplify';

type Props = RouteComponentProps & {};

const LogoutContainer = (props: Props) => {
  useEffect(() => {
    Auth.signOut().then(() => {
      window.location.href = '/';
    });
  }, []);

  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LogoutContainer;
