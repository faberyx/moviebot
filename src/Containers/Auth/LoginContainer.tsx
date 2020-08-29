/** @jsx createElement */
import {
  createElement,
  useState,
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
} from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  Avatar,
  Typography,
  Paper,
  Snackbar,
  LinearProgress,
  SnackbarCloseReason,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Auth } from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { validateEmail } from "../../Utils/validation";
import { AuthKey } from "../../Utils/constants";
import Slide from "@material-ui/core/Slide";

type Props = RouteComponentProps & {};

export const LoginContainer = (props: Props) => {
  const classes = useStyles();
  const formData = {
    email: "",
    password: "",
  };

  const loginData = {
    message: "",
    type: "",
    success: false,
    loggedin: false,
  };
  const [values, setValues] = useState(formData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(loginData);

  const handleChange = (value: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (error.email || error.password) {
      setError(formData);
    }
    setValues({ ...values, [value]: event.target.value });
  };

  const handleClose = (value: typeof loginData) => (
    event: SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (value.type === "UserNotConfirmedException") {
      props.history.push(`/confirm?email=${values.email}`);
    }
    setLogin(loginData);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let errors = formData;
    if (!values.email || !validateEmail(values.email)) {
      errors = { ...errors, email: "Invalid email" };
    }
    if (!values.password) {
      errors = {
        ...errors,
        password:
          "Invalid password! Must contain at least 6 character, 1 uppercase and 1 special character",
      };
    }
    setError(errors);
    event.preventDefault();

    if (error.email === "" && error.password === "") {
      setLoading(true);
      try {
        const user = await Auth.signIn(values.email, values.password);

        setLoading(false);
        localStorage.setItem(
          AuthKey,
          user.signInUserSession.accessToken.jwtToken
        );
        console.log(props.location);
        window.location.href = "/";
      } catch (err) {
        console.log(err);
        setLoading(false);
        setLogin({
          message: `Error while logging in. ${
            err.message || "Please try again.."
          }`,
          type: err.code || "",
          success: false,
          loggedin: true,
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      {loading && <LinearProgress color="secondary" />}
      <Paper elevation={3} className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            onChange={handleChange("email")}
            fullWidth
            id="email"
            value={values.email}
            error={error.email !== ""}
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
            value={values.password}
            error={error.password !== ""}
            helperText={error.password}
            onChange={handleChange("password")}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgotpassword">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/register">Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={login.type === "redirect" ? 1000 : 3000}
        open={login.loggedin}
        TransitionComponent={Slide}
        onClose={handleClose(login)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={login.success ? "success" : "error"}
        >
          <strong>{login.message}</strong>
        </Alert>
      </Snackbar>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(22),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 50px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
