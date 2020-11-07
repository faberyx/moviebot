/** @jsx createElement */
import { createElement, useState, ChangeEvent, FormEvent, Fragment } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Auth from '@aws-amplify/auth';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { validateEmail } from '../../Utils/validation';
import { AuthTitle } from '../../Components/Auth/AuthTilte';
import { AuthContainer, AuthData } from '../../Components/Auth/AuthContainer';

type Props = RouteComponentProps & {};

const ForgotPasswordContainer = (props: Props) => {
  const formData = {
    email: ''
  };
  const confirmationData: AuthData = {
    message: '',
    success: false,
    completed: false,
    type: '',
    email: ''
  };
  const classes = useStyles();

  const [values, setValues] = useState(formData);
  const [email, setEmail] = useState('');
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
  const handleClose = (value: typeof confirmationData) => () => {
    if (value.type === 'redirect') {
      props.history.push(`/resetpassword?email=${email}`);
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
          message: 'You will soon receive your password reset email! Now you can reset your password!',
          success: true,
          completed: true,
          type: 'redirect',
          email: values.email
        });
        setEmail(values.email);
        setValues(formData);
      } catch (err) {
        setLoading(false);
        setConf({
          message: `There was an error resetting the password. ${err.message || 'Please try again..'}`,
          success: false,
          completed: true,
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
    <AuthContainer title={<AuthTitle variant="h4" title="Forgot Password" />} authData={reg} loading={loading} onSubmit={handleSubmit} onClose={handleClose}>
      <Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField variant="outlined" data-testid="email" required fullWidth onChange={handleChange('email')} label="Email Address" value={values.email} />
          </Grid>
        </Grid>

        <Button type="submit" data-testid="resetpassword-button" fullWidth variant="contained" color="primary" disabled={loading} className={classes.submit}>
          Reset Passowrd
        </Button>
        <Grid container justify="flex-end">
          <Grid item xs>
            <Link data-testid="link-logon" to="/login">
              I have my password!
            </Link>
          </Grid>
          <Grid item>
            <Link data-testid="link-resetpassword" to={`/resetpassword${values.email ? `email = ${values.email}` : ''}`}>
              I have a code!
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

export default ForgotPasswordContainer;
