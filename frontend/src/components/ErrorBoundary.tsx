import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/notes';
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#08090A] to-[#101011] flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-[#18191A] border border-neutral-800 rounded-lg p-8 shadow-xl">
            {/* Icône d'erreur */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-[#4A1D1D] border border-[#7A2D2D] rounded-full">
              <svg className="w-8 h-8 text-[#F87171]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Message principal */}
            <h1 className="text-24 font-semibold text-neutral-100 text-center mb-3">
              Une erreur s'est produite
            </h1>
            <p className="text-15 text-neutral-400 text-center mb-6">
              L'application a rencontré un problème inattendu.
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-center mb-6">
              <button
                onClick={this.handleReload}
                className="px-6 py-2.5 bg-[#575BC7] hover:bg-[#6C78E6] text-white text-14 font-medium rounded-lg transition-colors"
              >
                Recharger la page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-14 font-medium rounded-lg transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>

            {/* Détails techniques (collapsible) */}
            <div className="border-t border-neutral-800 pt-4">
              <button
                onClick={this.toggleDetails}
                className="flex items-center justify-between w-full text-13 text-neutral-500 hover:text-neutral-400 transition-colors"
              >
                <span>Détails techniques</span>
                <svg
                  className={`w-4 h-4 transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {this.state.showDetails && (
                <div className="mt-4 p-4 bg-[#0D0E0F] border border-neutral-800 rounded-lg">
                  <p className="text-13 text-red-400 font-mono mb-2">
                    {this.state.error?.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-11 text-neutral-500 overflow-x-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}