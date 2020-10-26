/** @jsx createElement */
import { createElement, memo, Fragment, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper/Paper';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography/Typography';

const HelpComponent = () => {
  const classes = useStyles();

  useEffect(() => {
    console.log('MOUNT Helo>');
  }, []);

  return (
    <Fragment>
      <Paper elevation={3} component="div" className={classes.mainContainer}>
        <div className={classes.titlecontainer}>
          <Typography variant="h4" color="secondary">
            <HelpIcon color="secondary" /> How to use your MovieBOT 🤖
          </Typography>
        </div>
      </Paper>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
    transition: '1s',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  titlecontainer: {
    height: '70px',
    width: '100%',
    padding: theme.spacing(2)
  },
  card: {
    background: 'rgba(0, 0, 0, 0.3)',
    color: '#eee',
    width: '100%',
    margin: theme.spacing(1, 0, 1)
  }
}));

export const Help = memo(HelpComponent);
