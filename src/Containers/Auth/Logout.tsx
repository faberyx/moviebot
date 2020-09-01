/** @jsx createElement */
import { createElement, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { CircularProgress, Backdrop } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { AuthKey } from "../../Utils/constants";

type Props = RouteComponentProps & {};

export const LogoutContainer = (props: Props) => {
  useEffect(() => {
    Auth.signOut().then(() => {
      localStorage.removeItem(AuthKey);
      window.location.href = "/";
    });
  }, []);

  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
