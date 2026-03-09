import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <AlertCircle className="text-red-500" size={48} />
          </div>
          <h2 className="text-3xl font-serif text-brand-cream mb-4">The Compass has stalled.</h2>
          <p className="text-brand-sage mb-8 max-w-md">An unexpected error occurred. We've logged the details and you can try to recalibrate by reloading.</p>
          
          {this.state.error && (
            <div className="w-full max-w-2xl bg-black/40 border border-white/10 rounded-2xl p-4 mb-8 text-left overflow-auto max-h-48 custom-scrollbar">
              <p className="text-red-400 font-mono text-xs whitespace-pre-wrap">
                {this.state.error.stack || this.state.error.message}
              </p>
            </div>
          )}

          <button 
            onClick={this.handleRetry}
            className="w-full max-w-xs py-5 bg-brand-green text-brand-teal rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-brand-green/20 hover:scale-[1.02] transition-transform"
          >
            <RefreshCw size={24} />
            Recalibrate
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
