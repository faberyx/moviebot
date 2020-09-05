/** @jsx createElement */
import { createElement, useState, ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import { SnackbarCloseReason } from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Auth } from 'aws-amplify';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { validateEmail } from '../../Utils/validation';
import Slide from '@material-ui/core/Slide';

type Props = RouteComponentProps & {};

const ForgotPasswordContainer = (props: Props) => {
  const formData = {
    email: ''
  };
  const confirmationData = {
    message: '',
    success: false,
    confirmed: false,
    type: '',
    email: ''
  };
  const classes = useStyles();

  const [values, setValues] = useState(formData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [reg, setConf] = useState(confirmationData);

  //----
  const handleChange = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (error.email) {
      setError(formData);
    }

    setValues({ ...values, [value]: event.target.value });
  };

  //--- CLOSE ALERT BANNER
  const handleClose = (value: typeof confirmationData) => (event: SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    if (value.type === 'redirect') {
      props.history.push(`/resetpassword?email=${values.email}`);
    }
    setConf(confirmationData);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let errors = formData;
    if (!values.email || !validateEmail(values.email)) {
      errors = {
        ...errors,
        email: 'Invalid password! Must contain at least 6 character, 1 uppercase and 1 special character'
      };
    }

    event.preventDefault();

    if (!errors.email) {
      setLoading(true);
      try {
        await Auth.forgotPassword(values.email);

        setLoading(false);
        setConf({
          message: 'Account activated successfully! Redirecting you in a few!',
          success: true,
          confirmed: true,
          type: 'redirect',
          email: values.email
        });
        setValues(formData);
      } catch (err) {
        setLoading(false);
        setConf({
          message: `There was an error resetting the password. ${err.message || 'Please try again..'}`,
          success: false,
          confirmed: true,
          email: '',
          type: err.code || ''
        });
        console.log(err);
      }
    } else {
      setError(errors);
    }
  };
  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      {loading && <LinearProgress color="secondary" />}
      <Paper elevation={3} className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{ padding: '20px' }}>
          Forgot Password
        </Typography>

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth onChange={handleChange('email')} label="Email Address" value={values.email} />
            </Grid>
          </Grid>

          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} className={classes.submit}>
            Reset Passowrd
          </Button>
          <Grid container justify="flex-end">
            <Grid item xs>
              <Link to="/login">I remember my password!</Link>
            </Grid>
            <Grid item>
              <Link to={`/resetpassword${values.email ? `email = ${values.email}` : ''}`}>I already have a code!</Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3000} open={reg.confirmed} TransitionComponent={Slide} onClose={handleClose(reg)}>
        <Alert elevation={6} variant="filled" severity={reg.success ? 'success' : 'error'}>
          <strong>{reg.message}</strong>
        </Alert>
      </Snackbar>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(22)
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 50px'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(2, 0, 1)
  }
}));

export default ForgotPasswordContainer;
