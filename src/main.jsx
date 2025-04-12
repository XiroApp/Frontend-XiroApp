import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Worker } from "@react-pdf-viewer/core";
import { AuthProvider } from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <Worker workerUrl="/worker-pdf.js">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Worker>
    </AuthProvider>
  </Provider>
);
