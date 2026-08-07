import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('JanSetu UI Catch:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">Something went wrong</h2>
            <p className="text-xs text-slate-400">
              A temporary interface error occurred. Please refresh the page or check dev tools.
            </p>
            {this.state.error?.message && (
              <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-rose-400 text-left overflow-x-auto border border-slate-800">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reload JanSetu App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
