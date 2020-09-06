/** @jsx createElement */
import { createElement, useState, ChangeEvent, FormEvent, SyntheticEvent, useEffect } from 'react';
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
import { validateEmail, validatePassword, validateCode } from '../../Utils/validation';
import Slide from '@material-ui/core/Slide';

type Props = RouteComponentProps & {};

const ResetPasswordContainer = (props: Props) => {
  const formData = {
    code: '',
    email: '',
    password: '',
    repeatPassword: ''
  };
  const registrationData = {
    message: '',
    success: false,
    confirmed: false,
    type: ''
  };
  const classes = useStyles();
  const [values, setValues] = useState(formData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [reg, setReg] = useState(registrationData);

  useEffect(() => {
    const email = props.location.search.split('=')[1];

    if (!validateEmail(email)) {
      setReg({
        message: 'Invalid email!!',
        success: false,
        confirmed: false,
        type: ''
      });
      return;
    }
    setValues({
      code: '',
      email,
      password: '',
      repeatPassword: ''
    });
  }, [props.location.search]);

  const handleChange = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (error.code || error.password || error.repeatPassword) {
      setError(formData);
    }
    console.log('>', reg, reg === null);

    setValues({ ...values, [value]: event.target.value });
  };

  const handleClose = (value: typeof registrationData) => (event: SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    if (value.type === 'redirect') {
      props.history.push(`/login`);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let errors = formData;
    if (!values.code || !validateCode(values.code)) {
      errors = { ...errors, code: 'Invalid code' };
    }
    if (!values.email || !validateEmail(values.email)) {
      errors = { ...errors, email: 'Invalid email' };
    }
    if (!values.password || !validatePassword(values.password)) {
      errors = {
        ...errors,
        password: 'Invalid password! Must contain at least 6 character, 1 uppercase and 1 special character'
      };
    }
    if (!values.repeatPassword || values.password !== values.repeatPassword) {
      errors = { ...errors, repeatPassword: 'Please use the same password!' };
    }

    event.preventDefault();

    if (error.code === '' && error.email === '' && error.password === '' && errors.repeatPassword === '') {
      setLoading(true);
      try {
        const resetPassword = await Auth.forgotPasswordSubmit(values.email, values.code, values.password);
        console.log(resetPassword);
        setLoading(false);
        setReg({
          message: 'Password reset successfully.. Redirecting you in a few!',
          success: true,
          confirmed: true,
          type: 'redirect'
        });
        setValues(formData);
      } catch (err) {
        setLoading(false);
        setReg({
          message: `There was an error resetting the password. ${err.message || 'Please try again..'}`,
          success: false,
          confirmed: true,
          type: ''
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
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Enter your email address"
                onChange={handleChange('email')}
                value={values.email}
                error={error.email !== ''}
                disabled={values.email !== ''}
                helperText={error.email}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Enter your verification code"
                onChange={handleChange('code')}
                value={values.code}
                error={error.code !== ''}
                helperText={error.code}
                autoComplete="code"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                onChange={handleChange('password')}
                fullWidth
                label="Password"
                type="password"
                value={values.password}
                error={error.password !== ''}
                helperText={error.password}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                onChange={handleChange('repeatPassword')}
                label="Repeat Password"
                type="password"
                value={values.repeatPassword}
                error={error.repeatPassword !== ''}
                helperText={error.repeatPassword}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} className={classes.submit}>
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={reg.type === 'redirect' ? 1000 : 3000}
        open={reg.confirmed}
        TransitionComponent={Slide}
        onClose={handleClose(reg)}
      >
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
    margin: theme.spacing(3, 0, 2)
  }
}));

export default ResetPasswordContainer;
