import { forwardRef, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page to continue.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: "10px 24px",
              borderRadius: 8,
              border: "1px solid #ccc",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = forwardRef<HTMLDivElement>(function App(_props, ref) {
  const pathname = window.location.pathname;
  const isKnownRoute = pathname === "/" || pathname === "/index";

  return (
    <div ref={ref}>
      <ErrorBoundary>
        {isKnownRoute ? <Index /> : <NotFound />}
      </ErrorBoundary>
    </div>
  );
});

App.displayName = "App";

export default App;
