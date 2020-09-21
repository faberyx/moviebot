/** @jsx createElement */
import { createElement, useState, ChangeEvent, FormEvent, useEffect, Fragment } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Auth } from 'aws-amplify';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { validateEmail, validatePassword, validateCode } from '../../Utils/validation';
import { AuthTitle } from '../../Components/Auth/AuthTilte';
import { AuthContainer, AuthData } from '../../Components/Auth/AuthContainer';

type Props = RouteComponentProps & {};

const ResetPasswordContainer = (props: Props) => {
  const formData = {
    code: '',
    email: '',
    password: '',
    repeatPassword: ''
  };
  const registrationData: AuthData = {
    message: '',
    success: false,
    completed: false,
    type: ''
  };
  const classes = useStyles();
  const [values, setValues] = useState(formData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [reg, setReg] = useState(registrationData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const code = urlParams.get('code');
    if (!email || !validateEmail(email)) {
      setReg({
        message: 'Invalid email!!',
        success: false,
        completed: false,
        type: ''
      });
      return;
    }

    setValues({
      code: code || '',
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

  const handleClose = (value: typeof registrationData) => () => {
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
          completed: true,
          type: 'redirect'
        });
        setValues(formData);
      } catch (err) {
        setLoading(false);
        setReg({
          message: `There was an error resetting the password. ${err.message || 'Please try again..'}`,
          success: false,
          completed: true,
          type: ''
        });
        console.log(err);
      }
    } else {
      setError(errors);
    }
  };
  return (
    <AuthContainer title={<AuthTitle variant="h4" title="Reset Password" />} authData={reg} loading={loading} onSubmit={handleSubmit} onClose={handleClose}>
      <Fragment>
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
            <Link to="/login">Sign In!</Link>
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

export default ResetPasswordContainer;
