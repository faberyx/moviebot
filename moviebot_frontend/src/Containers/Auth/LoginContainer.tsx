/** @jsx createElement */
import { createElement, useState, ChangeEvent, FormEvent, Fragment } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Auth from '@aws-amplify/auth';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { validateEmail } from '../../Utils/validation';
import { AuthContainer, AuthData } from '../../Components/Auth/AuthContainer';
import { AuthTitle } from '../../Components/Auth/AuthTilte';
import { deleteSession } from '../../Utils/lexProvider';

type Props = RouteComponentProps & {};

const LoginContainer = (props: Props) => {
  const classes = useStyles();
  const formData = {
    email: '',
    password: ''
  };
  const userData = {
    email: '',
    password: ''
  };

  const loginData: AuthData = {
    message: '',
    type: '',
    success: false,
    completed: false
  };
  const [email, setEmail] = useState('');
  const [values, setValues] = useState(userData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(loginData);

  const handleChange = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (error.email || error.password) {
      setError(formData);
    }
    setValues({ ...values, [value]: event.target.value });
  };

  const handleClose = (value: typeof loginData) => () => {
    if (value.type === 'UserNotConfirmedException') {
      props.history.push(`/confirm?email=${email}`);
    }
    setLogin(loginData);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let errors = formData;
    if (!values.email || !validateEmail(values.email)) {
      errors = { ...errors, email: 'Invalid email' };
    }
    if (!values.password) {
      errors = {
        ...errors,
        password: 'Invalid password! Must contain at least 6 character, 1 uppercase and 1 special character'
      };
    }
    setError(errors);
    event.preventDefault();

    if (error.email === '' && error.password === '') {
      setLoading(true);
      try {
        await Auth.signIn(values.email, values.password);
        setEmail(values.email);
        setValues(formData);
        // RESET FROM THE PREVIOUS SESSION
        await deleteSession();
        window.location.href = '/';
      } catch (err) {
        console.log(err);
        setLoading(false);
        setLogin({
          message: `Error while logging in. ${err.message || 'Please try again..'}`,
          type: err.code || '',
          success: false,
          completed: true
        });
      }
    }
  };

  return (
    <AuthContainer title={<AuthTitle title="Sign in" />} authData={login} loading={loading} onSubmit={handleSubmit} onClose={handleClose}>
      <Fragment>
        <TextField
          variant="outlined"
          margin="normal"
          required
          onChange={handleChange('email')}
          fullWidth
          id="email"
          data-testid="email"
          value={values.email}
          error={error.email !== ''}
          helperText={error.email}
          label="Email Address"
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          data-testid="password"
          value={values.password}
          error={error.password !== ''}
          helperText={error.password}
          onChange={handleChange('password')}
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />

        <Button type="submit" data-testid="login-button" fullWidth variant="contained" color="primary" className={classes.submit}>
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link data-testid="link-forgetpassword" to="/forgotpassword">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link data-testid="link-register" to="/register">
              Register!
            </Link>
          </Grid>
        </Grid>
      </Fragment>
    </AuthContainer>
  );
};

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default LoginContainer;
