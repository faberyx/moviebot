/** @jsx createElement */
import { createElement, PureComponent } from 'react';

export class ErrorBoundary extends PureComponent {
  state = {
    hasError: false,
    errorMessage: ''
  };

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true, message: info });
    console.error(`☠️ Component error`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h3>Ups...there was an error {}</h3>;
    } else {
      return this.props.children;
    }
  }
}
