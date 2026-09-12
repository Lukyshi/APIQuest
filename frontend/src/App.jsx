import { Component } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import queryClient from './app/queryClient';
import AppRouter from './app/router';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#0d0d12', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'monospace' }}>
          <div style={{ background: '#14141c', border: '2px solid #f43f5e', borderRadius: '12px', padding: '2rem', maxWidth: '700px', width: '100%' }}>
            <div style={{ color: '#f43f5e', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>🔴 App Crashed — React Error</div>
            <pre style={{ color: '#fca5a5', fontSize: '0.8rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {this.state.error?.message}
              {'\n\n'}
              {this.state.error?.stack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1d1d35',
              color: '#f1f5f9',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f59e0b', secondary: '#0d0d12' } },
            error:   { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
