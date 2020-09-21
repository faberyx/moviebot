/** @jsx createElement */
import { createElement, Suspense } from 'react';
import { render } from 'react-dom';
import Amplify from 'aws-amplify';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ErrorBoundary } from './Components/ErrorBoundary';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import Routes from './Navigation/Routes';
import './global.css';

/** Amplify config */
import awsconfig from './aws-exports';

/** Service worker */
import * as serviceWorker from './serviceWorker';

// RECOIL   STATE MANAGER
import { RecoilRoot } from 'recoil';

/** Configure amplify */
Amplify.configure(awsconfig);

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: blue[800]
    },
    secondary: {
      // This is green.A700 as hex.
      main: purple.A200
    }
  }
});

const root = document.getElementById('root');

render(
  <RecoilRoot>
    <Suspense
      fallback={
        <Backdrop open>
          <CircularProgress color="primary" />
        </Backdrop>
      }
    >
      <ThemeProvider theme={responsiveFontSizes(theme)}>
        <CssBaseline />
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </ThemeProvider>
    </Suspense>
  </RecoilRoot>,
  root
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
