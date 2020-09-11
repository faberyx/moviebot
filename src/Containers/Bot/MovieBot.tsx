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

type Props = RouteComponentProps & {};

/*
 */
const MovieBotContainer = (props: Props) => {
  // **************************************************
  //   STATE MANAGEMENT
  // **************************************************
  const classes = useStyles();

  return (
    <Fragment>
      <Container component="main" maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} className={classes.grid}>
          <Grid item xs={8} className={classes.grid}>
            <MovieBox />
          </Grid>
          <Grid item xs={4} className={classes.grid}>
            <ChatBox />
          </Grid>
        </Grid>
      </Container>
      <DialButton route={props} />
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
