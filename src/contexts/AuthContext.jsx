// src/contexts/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { login as apiLogin } from "../api/auth/auth";

const AuthContext = createContext(null);
function parseJwt(token) {
  try {
    const base64 = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return (
            "%" +
            (
              "00" + c.charCodeAt(0).toString(16)
            ).slice(-2)
          );
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  return payload.exp * 1000 < Date.now();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem("gc_token");
      const storedUser =
        localStorage.getItem("gc_user");

      if (storedToken && storedUser) {
        if (!isTokenExpired(storedToken)) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          localStorage.removeItem("gc_token");
          localStorage.removeItem("gc_user");
        }
      }
    } catch (err) {
      console.error("Auth init error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user && !!token;

  const login = async ({
    identifier,
    password,
    rememberMe,
  }) => {
    const data = await apiLogin({
      identifier,
      password,
    });

    setToken(data.jwt);
    setUser(data.user);

    localStorage.setItem("gc_token", data.jwt);
    localStorage.setItem(
      "gc_user",
      JSON.stringify(data.user),
    );

    if (rememberMe) {
      localStorage.setItem(
        "gc_remember",
        JSON.stringify({
          u: identifier,
          p: password,
        }),
      );
    } else {
      localStorage.removeItem("gc_remember");
    }

    return data;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("gc_token");
    localStorage.removeItem("gc_user");
    localStorage.removeItem("gc_remember");
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }
  return ctx;
}
