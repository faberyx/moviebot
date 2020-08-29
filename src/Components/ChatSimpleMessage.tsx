/** @jsx createElement */
import { createElement, ReactNode } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import "./dots.css";

type Props = {
  children: ReactNode;
  type: "bot" | "human";
  loading?: boolean;
};

export const ChatSimpleMessage = ({
  children,
  type,
  loading = false,
}: Props) => {
  const classes = useStyles(type)();
  return loading ? (
    <Grid container>
      {type === "bot" && <Grid item xs={4}></Grid>}
      <Grid item xs={8}>
        <div className={classes.bubble}>
          <div className="dot-flashing"> </div>
        </div>
      </Grid>
      {type === "human" && <Grid item xs={4}></Grid>}
    </Grid>
  ) : (
    <Grid container>
      {type === "bot" && <Grid item xs={4}></Grid>}
      <Grid item xs={8}>
        <div className={classes.bubble}>{children}</div>
      </Grid>
      {type === "human" && <Grid item xs={4}></Grid>}
    </Grid>
  );
};

const useStyles = (type: "bot" | "human") =>
  makeStyles((theme) => ({
    bubble: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      padding: "15px 25px",
      marginBottom: "25px",
      fontSize: "1.2em",
      lineHeight: "1.1em",
      position: "relative",
      borderRight:
        type === "bot" ? `8px solid ${theme.palette.secondary.light}` : 0,
      borderLeft:
        type === "bot" ? 0 : `8px solid ${theme.palette.primary.light}`,

      borderRadius: "10px",
      "&::after": {
        content: "''",
        marginTop: "-30px",
        paddingTop: "0px",
        position: "absolute",
        bottom: "-20px",
        right: type === "bot" ? "10px" : "unset",
        left: type === "bot" ? "unset" : "10px",
        borderWidth: type === "bot" ? "30px 0 0 30px" : "30px 30px 0 0",
        borderStyle: "solid",
        display: "block",
        width: "0",
        borderColor: `${theme.palette.background.default} transparent`,
      },
    },
  }));
