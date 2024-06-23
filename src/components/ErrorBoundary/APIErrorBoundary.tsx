import { Component, ErrorInfo, ReactNode } from "react";

import DefaultErrorBoundary from "./DefaultErrorBoundary";
import { ApiError } from "#/api/customError";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class APIErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  public render() {
    if (this.state.error instanceof ApiError && this.state.hasError) {
      return this.props.fallback || <DefaultErrorBoundary error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default APIErrorBoundary;
