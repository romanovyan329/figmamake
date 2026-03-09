import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#E8F2FF] to-white p-4">
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md">
            <h2 className="font-['Figtree',sans-serif] font-bold text-xl text-red-600 mb-3">
              Something went wrong
            </h2>
            <p className="font-['Inter',sans-serif] text-sm text-gray-700 mb-4">
              {this.state.error?.message || 'An unknown error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#207DF0] text-white font-['Inter',sans-serif] font-semibold py-3 px-4 rounded-lg"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
