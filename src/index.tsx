/** @jsx createElement */
import { createElement } from 'react';
import { render } from 'react-dom';
import Amplify from 'aws-amplify';
import './global.css';

/** Amplify config */
import awsconfig from './aws-exports';

import Routes from './Navigation/Routes';

/** Service worker */
import * as serviceWorker from './serviceWorker';

/** Configure amplify */
Amplify.configure(awsconfig);

render(<Routes />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
