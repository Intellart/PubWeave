// @flow
import React from 'react';
import type { ComponentType } from 'react';

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  store: any,
  children: any,
};

type State = {
  hasError: boolean,
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  // componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
  // }

  handleReload() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrapper">
          <div className="error-boundary-content">
            <h1 className="code">500</h1>
            <h2 className="title">Ooops...</h2>
            <span className="description">An error happened!</span>
            <button className="button is-primary" onClick={() => this.handleReload()}>
              Restart
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default (ErrorBoundary: ComponentType<Props>);
