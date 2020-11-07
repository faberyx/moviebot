/** @jsx createElement */
import { createElement, useState, ChangeEvent, FormEvent, useEffect, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Auth from '@aws-amplify/auth';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { validateCode, validateEmail } from '../../Utils/validation';
import { AuthTitle } from '../../Components/Auth/AuthTilte';
import { AuthContainer, AuthData } from '../../Components/Auth/AuthContainer';

type Props = RouteComponentProps & {};

const ConfirmEmailContainer = (props: Props) => {
  const formData = {
    code: '',
    email: ''
  };
  const confirmationData: AuthData = {
    message: '',
    success: false,
    completed: false,
    type: ''
  };
  const classes = useStyles();

  const [values, setValues] = useState(formData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [reg, setConf] = useState(confirmationData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const code = urlParams.get('code');
    if (!email || !validateEmail(email)) {
      setConf({
        message: 'Invalid email!!',
        success: false,
        completed: false,
        type: ''
      });
      return;
    }
    setValues({
      code: code || '',
      email
    });
  }, [props.location.search]);

  //----
  const handleChange = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
    if (error.code) {
      setError(formData);
    }

    setValues({ ...values, [value]: event.target.value });
  };

  //--- CLOSE ALERT BANNER
  const handleClose = (value: typeof confirmationData) => () => {
    if (value.type === 'redirect') {
      props.history.push(`/login`);
    }
    setConf(confirmationData);
  };

  const handleResend = async () => {
    try {
      await Auth.resendSignUp(values.email);
      setConf({
        message: 'Code sent successfully! Please check your email..',
        success: true,
        completed: true,
        type: 'redirect'
      });
    } catch (err) {
      setConf({
        message: `Impossible to send the activation code. ${err.message || 'Please try again..'}`,
        success: false,
        completed: true,
        type: err.code || ''
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let errors = formData;
    if (!values.code || !validateCode(values.code)) {
      errors = { ...errors, code: 'Invalid code!' };
    }

    event.preventDefault();

    if (!errors.code) {
      setLoading(true);
      try {
        await Auth.confirmSignUp(values.email, values.code);

        setLoading(false);
        setConf({
          message: 'Account activated successfully! Redirecting you in a few!',
          success: true,
          completed: true,
          type: 'redirect'
        });
        setValues(formData);
      } catch (err) {
        setLoading(false);
        setConf({
          message: `There was an error activating the user. ${err.message || 'Please try again..'}`,
          success: false,
          completed: true,
          type: err.code || ''
        });
        console.log(err);
      }
    } else {
      setError(errors);
    }
  };
  return (
    <AuthContainer title={<AuthTitle title="Confirm Email" />} authData={reg} loading={loading} onSubmit={handleSubmit} onClose={handleClose}>
      <Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField variant="outlined" data-testid="email" cdata-testid="emai" required fullWidth label="Email Address" value={values.email} disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              data-testid="confirmationcode"
              required
              onChange={handleChange('code')}
              fullWidth
              label="Enter confirmation code"
              value={values.code}
              error={error.code !== ''}
              helperText={error.code}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" data-testid="activate-button" color="primary" disabled={loading} className={classes.submit}>
          Activate
        </Button>

        <Button type="button" fullWidth variant="contained" data-testid="resend-button" color="secondary" onClick={handleResend} disabled={loading} className={classes.submit}>
          Resend Activation Code
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="/login" data-testid="link-login" variant="body2">
              Sign in
            </Link>
          </Grid>
        </Grid>
      </Fragment>
    </AuthContainer>
  );
};

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(2, 0, 1)
  }
}));

export default ConfirmEmailContainer;
