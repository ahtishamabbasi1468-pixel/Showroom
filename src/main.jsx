import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ToastProvider } from "./components/common/Toast";
import App from "./App.jsx";
import "./components/common/Tilt3D.css";
import "./components/layout/layout.css";
import "./styles/global.css";
import "./styles/pages.css";
import "./components/admin/admin.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
