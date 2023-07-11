import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { ROUTES } from 'routes';
import { Token } from 'storage';

type authContextType = {
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const AuthContext = React.createContext<authContextType>({
  connected: false,
  setConnected: () => {
    return;
  },
  token: '',
  setToken: () => {
    return;
  },
});

type AuthProviderProps = {
  authenticated: boolean;
  requestToken?: string;
};

export const AuthProviders: React.FC<React.PropsWithChildren<AuthProviderProps>> = ({
  authenticated,
  children,
  requestToken,
}) => {
  const [connected, setConnected] = useState(authenticated || !!new Token().get());
  const [token, setToken] = useState(requestToken || new Token().get() || undefined);
  useEffect(() => {
    if (new Token().get()) {
      setToken(new Token().get());
    }
  }, [connected]);

  return <AuthContext.Provider value={{ connected, setConnected, setToken, token }}>{children}</AuthContext.Provider>;
};

export const useIsAuth = () => {
  const { connected } = useContext(AuthContext);
  return connected;
};

type DecodedPayload = {
  roles: ReadonlyArray<string>;
  username: string;
  user_id: string;
};

export const useMe = (): DecodedPayload => {
  const { token } = useContext(AuthContext);
  const payload = token?.split('.')?.[1];
  if (payload) {
    try {
      return JSON.parse(atob(payload)) as DecodedPayload;
    } catch {
      console.log;
    }
  }

  return {} as DecodedPayload;
};

export const useDispatchAuth = () => {
  const { setConnected } = useContext(AuthContext);
  return setConnected;
};

export const useRedirectIfLogged = () => {
  const { push } = useRouter();
  const isAuthenticated = useIsAuth();

  useEffect(() => {
    if (isAuthenticated) {
      push(ROUTES.HOME);
    }
  }, [isAuthenticated, push]);
};

export const useRedirectIfNotLogged = () => {
  const { push } = useRouter();
  const isAuthenticated = useIsAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      push(ROUTES.SIGN_IN);
    }
  }, [isAuthenticated, push]);
};
