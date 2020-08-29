/** @jsx createElement */
import {
  createElement,
  useState,
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  MouseEvent,
} from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Container,
  Avatar,
  Typography,
  Link,
  Paper,
  Snackbar,
  LinearProgress,
  SnackbarCloseReason,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Auth } from "aws-amplify";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { validateCode, validateEmail } from "../../Utils/validation";
import Slide from "@material-ui/core/Slide";

type Props = RouteComponentProps & {};

export const ForgotPasswordContainer = (props: Props) => {
  const formData = {
    email: "",
  };
  const confirmationData = {
    message: "",
    success: false,
    confirmed: false,
    type: "",
  };
  const classes = useStyles();

  const [values, setValues] = useState(formData);
  const [error, setError] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [reg, setConf] = useState(confirmationData);

  //----
  const handleChange = (value: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (error.email) {
      setError(formData);
    }

    setValues({ ...values, [value]: event.target.value });
  };

  //--- CLOSE ALERT BANNER
  const handleClose = (value: typeof confirmationData) => (
    event: SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (value.type === "redirect") {
      props.history.push(`/`);
    }
    setConf(confirmationData);
  };

  const handleResend = async (event: MouseEvent<HTMLButtonElement>) => {
    try {
      await Auth.forgotPassword(values.email);
      setConf({
        message: "Code sent successfully! Please check your email..",
        success: true,
        confirmed: true,
        type: "",
      });
    } catch (err) {
      setConf({
        message: `Impossible to send the activation code. ${
          err.message || "Please try again.."
        }`,
        success: false,
        confirmed: true,
        type: err.code || "",
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let errors = formData;
    if (!values.email || !validateCode(values.email)) {
      errors = { ...errors, email: "Invalid email!" };
    }

    event.preventDefault();

    if (!errors.email) {
      setLoading(true);
      try {
        await Auth.forgotPassword(values.email);

        setLoading(false);
        setConf({
          message: "Account activated successfully! Redirecting you in a few!",
          success: true,
          confirmed: true,
          type: "redirect",
        });
      } catch (err) {
        setLoading(false);
        setConf({
          message: `There was an error activating the user. ${
            err.message || "Please try again.."
          }`,
          success: false,
          confirmed: true,
          type: err.code || "",
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
        <Typography component="h1" variant="h5">
          Confim Email
        </Typography>

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                value={values.email}
                disabled
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submit}
          >
            Activate
          </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={handleResend}
            disabled={loading}
            className={classes.submit}
          >
            Resend Activation Code
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Have you already activated? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        open={reg.confirmed}
        TransitionComponent={Slide}
        onClose={handleClose(reg)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={reg.success ? "success" : "error"}
        >
          <strong>{reg.message}</strong>
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
    margin: theme.spacing(2, 0, 1),
  },
}));
