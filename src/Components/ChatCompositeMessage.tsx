/** @jsx createElement */
import { createElement, Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import './dots.css';
import { CompositeResponse } from '../interfaces/compositeResponse';

type Props = {
  response?: string;
};

export const ChatCompositeMessage = ({ response }: Props) => {
  const classes = useStyles();

  if (response) {
    const responsePayload = JSON.parse(response);
    console.log(responsePayload);
  }
  //  {e.key} : {e.value}
  return (
    <Fragment>
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
          <div className={classes.bubble}>TEST</div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  bubble: {
    backgroundColor: '#e8e8e8',
    color: theme.palette.text.primary,
    padding: '15px 25px',
    marginBottom: '25px',
    fontSize: '1.0em',
    lineHeight: '1.1em',
    position: 'relative',
    borderLeft: `5px solid ${theme.palette.primary.light}`,

    borderRadius: '10px',
    '&::after': {
      content: "''",
      marginTop: '-20px',
      paddingTop: '0px',
      position: 'absolute',
      bottom: '-20px',
      left: '5px',
      borderWidth: '20px 20px 0 0',
      borderStyle: 'solid',
      display: 'block',
      width: '0',
      borderColor: `#e8e8e8 transparent`
    }
  }
}));
