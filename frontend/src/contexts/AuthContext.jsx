import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { loginRequest, signupRequest } from "../services/authService";
import { getErrorMessage } from "../utils/helpers";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ttm_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("ttm_token"));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("ttm_token", token);
    } else {
      localStorage.removeItem("ttm_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("ttm_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ttm_user");
    }
  }, [user]);

  const login = async (payload) => {
    try {
      setIsLoading(true);
      const data = await loginRequest(payload);
      setToken(data.token);
      setUser(data.user);
      toast.success("Welcome back");
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload) => {
    try {
      setIsLoading(true);
      const data = await signupRequest(payload);
      setToken(data.token);
      setUser(data.user);
      toast.success("Account created");
      return data.user;
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
