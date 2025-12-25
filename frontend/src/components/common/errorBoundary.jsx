import React from "react";
import { toast } from "react-toastify";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    toast.error("An unexpected error occurred. Please refresh the page.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <h4 className="text-danger mb-3">Something went wrong</h4>
              <p className="text-muted mb-4">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

