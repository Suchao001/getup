import ReactDOM from 'react-dom/client'
import React from "react";
import RenderNavigation from './renderNavigation.jsx';
import Setroute from './Setroute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import './css/main.css';
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <RenderNavigation />
      <Setroute />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
