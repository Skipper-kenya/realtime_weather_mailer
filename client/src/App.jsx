import React from "react";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import GlobalProvider from "./context/GlobalProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import Protected from "./components/Protected";
import ProtectHomepage from "./components/ProtectHomepage";

function App() {
  const loading = useSelector((state) => state.loading.loading);
  return (
    <GlobalProvider>
      <Toaster richColors position="top-center" />
      <Router>
        <Spin fullscreen spinning={loading} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectHomepage>
                <Dashboard />
              </ProtectHomepage>
            }
          />
          <Route
            path="/signin"
            element={
              <Protected>
                <SignIn />
              </Protected>
            }
          />
          <Route
            path="/signup"
            element={
              <Protected>
                <SignUp />
              </Protected>
            }
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
