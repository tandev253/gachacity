// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import App from "./App.jsx";
import "./styles/global.css";
const GOOGLE_CLIENT_ID =
  "1007972263396-6m03mloc9bmkdmbgv9lcubetl8ii4ri9.apps.googleusercontent.com";

ReactDOM.createRoot(
  document.getElementById("root"),
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
    >
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
