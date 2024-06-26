import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { updateUser } from "../redux/user";
import { Context } from "../context/GlobalProvider";
import { isUserAuthenticated } from "../utils/IsUserAuthenticated";

const Protected = ({ children }) => {
  const { cookie } = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }

    if (cookie?.jwtToken) {
      isUserAuthenticated(cookie, dispatch);
    }
  }, [authenticated]);

  if (!authenticated) {
    return children;
  }
};

export default Protected;
