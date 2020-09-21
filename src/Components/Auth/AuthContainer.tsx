/** @jsx createElement */
import { createElement, FormEvent, ReactElement, ReactNode } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Slide from '@material-ui/core/Slide';

export type AuthData = {
  message: string;
  type: string;
  success: boolean;
  completed: boolean;
  email?: string;
};

type Props = {
  authData: AuthData;
  loading: boolean;
  onClose: (value: AuthData) => () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  title: ReactElement;
  children: ReactNode;
};

export const AuthContainer = ({ authData, title, onClose, onSubmit, children, loading = false }: Props) => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      {loading && <LinearProgress color="primary" />}
      <Paper elevation={3} className={classes.paper}>
        {title}
        <form onSubmit={onSubmit} className={classes.form} noValidate>
          {children}
        </form>
      </Paper>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={authData.type === 'redirect' ? 1000 : 3000} open={authData.completed} TransitionComponent={Slide} onClose={onClose(authData)}>
        <Alert elevation={6} variant="filled" severity={authData.success ? 'success' : 'error'}>
          <strong>{authData.message}</strong>
        </Alert>
      </Snackbar>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(22),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2)
    }
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    padding: '20px 35px',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 15px'
    },
    marginTop: theme.spacing(1)
  }
}));
