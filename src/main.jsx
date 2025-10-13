// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

function ErrorBoundary({ children }) {
  // minimal client-only error boundary
  return (
    <Boundary>{children}</Boundary>
  );
}

// lightweight boundary implementation
class Boundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, info: null };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // keep it simple: log to console so you can see it if something breaks again
    console.error('App crashed:', error, info);
    this.setState({ info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto' }}>
          <h2>Something went wrong</h2>
          <p>Please refresh. If this persists, check the console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
