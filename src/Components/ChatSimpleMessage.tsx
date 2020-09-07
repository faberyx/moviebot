/** @jsx createElement */
import { createElement, ReactNode } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

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
      {type === 'human' && <Grid item xs={3}></Grid>}
      <Grid item xs={9}>
        <div className={classes.bubble}>
          <div className="dot-flashing"> </div>
        </div>
      </Grid>
      {type === 'human' && <Grid item xs={3}></Grid>}
    </Grid>
  ) : (
    <Grid container>
      {type === 'human' && <Grid item xs={3}></Grid>}
      <Grid item xs={9}>
        <div className={classes.bubble}>{children}</div>
      </Grid>
      {type === 'bot' && <Grid item xs={3}></Grid>}
    </Grid>
  );
};

const useStyles = (type: 'bot' | 'human') =>
  makeStyles((theme) => ({
    bubble: {
      backgroundColor: type === 'human' ? '#f1f1f1' : '#e0e5f1',
      color: '#666',
      padding: '10px 25px',
      marginBottom: '25px',
      fontSize: '1.1em',
      lineHeight: '1.7em',
      position: 'relative',
      borderRight: type === 'human' ? `5px solid ${theme.palette.secondary.light}` : 0,
      borderLeft: type === 'human' ? 0 : `5px solid ${theme.palette.primary.light}`,

      borderRadius: '10px',
      '&::after': {
        content: "''",
        marginTop: '-22px',
        paddingTop: '0px',
        position: 'absolute',
        bottom: '-18px',
        right: type === 'human' ? '5px' : 'unset',
        left: type === 'human' ? 'unset' : '5px',
        borderWidth: type === 'human' ? '20px 0 0 20px' : '20px 20px 0 0',
        borderStyle: 'solid',
        display: 'block',
        width: '0',
        borderColor: type === 'human' ? '#f1f1f1 transparent' : '#e0e5f1 transparent'
      }
    }
  }));
