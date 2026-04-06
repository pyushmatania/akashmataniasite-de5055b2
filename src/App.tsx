import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; errorCount: number }
> {
  state = { hasError: false, errorCount: 0 };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info);
    this.setState((prev) => ({ errorCount: prev.errorCount + 1 }));
  }

  handleRetry = () => {
    if (this.state.errorCount >= 3) {
      window.location.reload();
    } else {
      this.setState({ hasError: false });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page to continue.</p>
          <button
            onClick={this.handleRetry}
            style={{
              marginTop: 16,
              padding: "10px 24px",
              borderRadius: 8,
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {this.state.errorCount >= 3 ? "Refresh Page" : "Try Again"}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const pathname = window.location.pathname;
  const isKnownRoute = pathname === "/" || pathname === "/index" || pathname === "/index.html";

  return (
    <ErrorBoundary>
      {isKnownRoute ? <Index /> : <NotFound />}
    </ErrorBoundary>
  );
}
