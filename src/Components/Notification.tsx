/** @jsx createElement */
import { createElement, memo, Fragment } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Backdrop, CircularProgress, Snackbar, Slide } from '@material-ui/core';
import { loaderState } from '../State/loader';
import { alertState } from '../State/alert';
import Alert from '@material-ui/lab/Alert';

const NotificationComponent = () => {
  const isLoading = useRecoilValue(loaderState);
  const alert = useRecoilValue(alertState);
  const reset = useResetRecoilState(alertState);
  const classes = useStyles();

  const handleClose = () => {
    reset();
  };
  return (
    <Fragment>
      {isLoading && (
        <Backdrop open className={classes.backDrop}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={alert.duration} open={alert.isOpen} TransitionComponent={Slide} onClose={handleClose}>
        <Alert elevation={6} variant="standard" severity={alert.severity}>
          <strong>{alert.message}</strong>
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

// **************************************************
//   PAGE STYLES
// **************************************************
const useStyles = makeStyles((theme) => ({
  backDrop: {
    zIndex: 3
  }
}));

export const Notification = memo(NotificationComponent);
