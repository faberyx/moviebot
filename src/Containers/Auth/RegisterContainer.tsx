/** @jsx createElement */
import { createElement, useState, ChangeEvent, FormEvent } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Auth } from 'aws-amplify';
import { validateEmail, validatePassword } from '../../Utils/validation';
import Slide from '@material-ui/core/Slide';
import { AuthTitle } from '../../Components/Auth/AuthTilte';

type Props = RouteComponentProps & {};

const RegisterContainer = (props: Props) => {
  const formData = {
    email: '',
    password: '',
    repeatPassword: ''
  };
  const registrationData = {
    message: '',
    success: false,
    registered: false,
    type: ''
  };
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [values, setValues] = useState(formData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [reg, setReg] = useState(registrationData);

  const handleChange = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (error.email || error.password || error.repeatPassword) {
      setError(formData);
    }
    console.log('>', reg, reg === null);

    setValues({ ...values, [value]: event.target.value });
  };

  const handleClose = (value: typeof registrationData) => () => {
    if (value.type === 'redirect') {
      props.history.push(`/confirm?email=${email}`);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let errors = formData;
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

    if (error.email === '' && error.password === '' && errors.repeatPassword === '') {
      setLoading(true);
      try {
        const signup = await Auth.signUp({
          username: values.email,
          password: values.password
        });
        console.log(signup);
        setLoading(false);
        setReg({
          message: 'Account created successfully, You have to activate your email now.. Redirecting you in a few!',
          success: true,
          registered: true,
          type: 'redirect'
        });
        setEmail(values.email);
      } catch (err) {
        setLoading(false);
        setReg({
          message: `There was an error registering the user. ${err.message || 'Please try again..'}`,
          success: false,
          registered: true,
          type: ''
        });
        console.log(err);
      }
      setValues(formData);
    } else {
      setError(errors);
    }
  };
  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      {loading && <LinearProgress color="primary" />}
      <Paper elevation={3} className={classes.paper}>
        <AuthTitle title="Register" />

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth label="Email Address" onChange={handleChange('email')} value={values.email} error={error.email !== ''} helperText={error.email} autoComplete="email" />
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
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={reg.type === 'redirect' ? 1000 : 3000} open={reg.registered} TransitionComponent={Slide} onClose={handleClose(reg)}>
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
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    padding: '20px 35px'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default RegisterContainer;
