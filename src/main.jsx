import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";

import App from "./App";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const app = <App />;

ReactDOM.createRoot(document.getElementById("root")).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
  ) : (
    app
  )
);
