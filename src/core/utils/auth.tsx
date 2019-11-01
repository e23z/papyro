import React, { useState, FunctionComponent, useEffect } from "react";
import { LoggedUser, getCurrUser, isAuthenticated, waitForAuth } from '../api/authApi';
import Loading from "../components/shared/Loading";

/**
 * @interface AuthStatus
 * @description The current status of the user.
 */
export interface AuthStatus {
  isLogged: boolean;
  currUser: LoggedUser | null;
  login: Function;
  logout: Function;
  enableLogin: Function;
  disableLogin: Function;
}

/**
 * @const A context to manage the global authentication state.
 */
export const AuthContext = React.createContext<AuthStatus>({
  isLogged: false,
  currUser: null,
  login: () => { },
  logout: () => { },
  enableLogin: () => { },
  disableLogin: () => { }
});

/**
 * @function AuthProvider {FunctionComponent}
 * @description The wrapper component responsible to manage the global auth state.
 * @param props {any} The default react props.
 * @return `{Component}` - The children component wrapped by the global state;
 */
export const AuthProvider: FunctionComponent = (props) => {
  // Overall state of the component
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [loading, setLoading] = useState(true);
  const [canLogin, setCanLogin] = useState(true);

  // Wait for the user state
  useEffect(() => {
    const unsubscribe = waitForAuth(user => {
      // If auto-login is disabled, just stop the loading
      if (!canLogin) {
        setLoading(false);
        return;
      }
      // Save the user and propagate the state
      setAuthenticated(user !== null);
      setLoading(false);
    });
    return () => unsubscribe();
  });

  // The value of the context
  const value = {
    isLogged: authenticated,
    currUser: getCurrUser(),
    login: () => setAuthenticated(true),
    logout: () => setAuthenticated(false),
    enableLogin: () => setCanLogin(true),
    disableLogin: () => setCanLogin(false)
  };

  // JSX
  if (loading)
    return <Loading />;

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}