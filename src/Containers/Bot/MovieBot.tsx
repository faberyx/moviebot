/* eslint-disable jsx-a11y/accessible-emoji */
/** @jsx createElement */
import { createElement, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid/Grid';
import { ChatBox } from '../../Components/Chat/ChatBox';
import { MovieBox } from '../../Components/Movie/MovieBox';
import { DialButton } from '../../Components/DialButton';
// import Hidden from '@material-ui/core/Hidden/Hidden';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import Alert from '@material-ui/lab/Alert/Alert';
import Slide from '@material-ui/core/Slide/Slide';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { alertState } from '../../State/alert';

type Props = RouteComponentProps & {};

/*
 */
const MovieBotContainer = (props: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();
  const alert = useRecoilValue(alertState);
  const reset = useResetRecoilState(alertState);
  const handleClose = () => {
    reset();
  };

  return (
    <Fragment>
      <Container component="main" maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={12} md={8} className={classes.grid}>
            <MovieBox />
          </Grid>

          <Grid item md={4} className={classes.grid}>
            <ChatBox />
          </Grid>
        </Grid>
      </Container>
      <DialButton route={props} />
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={alert.duration} open={alert.isOpen} TransitionComponent={Slide} onClose={handleClose}>
        <Alert elevation={6} variant="filled" severity={alert.severity}>
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
  grid: {
    height: '100%'
  },
  container: {
    marginTop: theme.spacing(4),
    height: 'calc(100% - 55px)'
  }
}));

export default MovieBotContainer;
