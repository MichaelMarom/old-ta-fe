import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import store from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './routes';
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const ClerkWithRoutes = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} navigate={(to) => navigate(to)} >
      {children}
    </ClerkProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ToastContainer position="bottom-center"
      className="custom-toast-container" />
    <Provider store={store}>
      <Router>
        <ClerkWithRoutes>
          <App />
        </ClerkWithRoutes>
      </Router>
    </Provider>
  </>
);

