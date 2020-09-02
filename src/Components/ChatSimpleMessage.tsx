/** @jsx createElement */
import { createElement, ReactNode } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import './dots.css';

type Props = {
  children: ReactNode;
  type: 'bot' | 'human';
  loading?: boolean;
};

export const ChatSimpleMessage = ({ children, type, loading = false }: Props) => {
  const classes = useStyles(type)();
  return loading ? (
    <Grid container>
      {type === 'human' && <Grid item xs={4}></Grid>}
      <Grid item xs={8}>
        <div className={classes.bubble}>
          <div className="dot-flashing"> </div>
        </div>
      </Grid>
      {type === 'human' && <Grid item xs={4}></Grid>}
    </Grid>
  ) : (
    <Grid container>
      {type === 'human' && <Grid item xs={4}></Grid>}
      <Grid item xs={8}>
        <div className={classes.bubble}>{children}</div>
      </Grid>
      {type === 'bot' && <Grid item xs={4}></Grid>}
    </Grid>
  );
};

const useStyles = (type: 'bot' | 'human') =>
  makeStyles((theme) => ({
    bubble: {
      backgroundColor: '#e8e8e8',
      color: theme.palette.text.primary,
      padding: '15px 25px',
      marginBottom: '25px',
      fontSize: '1.0em',
      lineHeight: '1.1em',
      position: 'relative',
      borderRight: type === 'human' ? `5px solid ${theme.palette.secondary.light}` : 0,
      borderLeft: type === 'human' ? 0 : `5px solid ${theme.palette.primary.light}`,

      borderRadius: '10px',
      '&::after': {
        content: "''",
        marginTop: '-20px',
        paddingTop: '0px',
        position: 'absolute',
        bottom: '-20px',
        right: type === 'human' ? '5px' : 'unset',
        left: type === 'human' ? 'unset' : '5px',
        borderWidth: type === 'human' ? '20px 0 0 20px' : '20px 20px 0 0',
        borderStyle: 'solid',
        display: 'block',
        width: '0',
        borderColor: `#e8e8e8 transparent`
      }
    }
  }));
