import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  resetKey?: any;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="bg-destructive/10 text-destructive border border-destructive/20 p-6 rounded-lg max-w-md">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="text-sm opacity-90">{this.state.error?.message || "An unexpected error occurred."}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
