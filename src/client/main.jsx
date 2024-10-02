import ReactDOM from 'react-dom/client'
import React from "react";
import RenderNavigation from './renderNavigation.jsx';
import Setroute from './Setroute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import './css/main.css';
import './index.css';
import { SwitchProvider } from './context/SwitchContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <SwitchProvider>
      <RenderNavigation />
      <Setroute />
    </SwitchProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
