import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useUserContext } from "./UserContext";
import { useNavigate } from "react-router";
import { validateExpireStoredStringDate } from "@common/util";
import { AuthService } from "@app/services";
import type { IRegisterInterface } from "@app/services/api/AuthService";

interface IAuthContextData {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (payload: IRegisterInterface) => Promise<void>;
  access_token: string | undefined;
  set_access_token: (value: string | undefined) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext({} as IAuthContextData);

interface IAuthProviderProps {
  children: React.ReactNode;
}

const KEY_ACCESS_TOKEN = "APP_ACCESS_TOKEN";
const KEY_EXPIRE_DATE = "APP_ACCESS_TOKEN_EXPIRE_DATE";
const KEY_CURRENT_USER = "APP_CURRENT_USER";

export function AuthProvider({ children }: IAuthProviderProps) {
  const navigate = useNavigate();

  const { changeUser } = useUserContext();

  const [accessToken, setAccessToken] = useState<string>();

  const isAuthenticated = useMemo(() => {
    return !!accessToken;
  }, [accessToken]);

  useEffect(() => {
    const sessionAccessToken = sessionStorage.getItem(KEY_ACCESS_TOKEN);
    const sessionExpireDate = sessionStorage.getItem(KEY_EXPIRE_DATE);
    const storedUserSession = sessionStorage.getItem(KEY_CURRENT_USER);
    if (sessionAccessToken && sessionExpireDate) {
      if (validateExpireStoredStringDate(sessionExpireDate)) {
        const parsed_token = JSON.parse(sessionAccessToken);
        setAccessToken(parsed_token);
        if (storedUserSession) {
          changeUser(JSON.parse(storedUserSession));
          navigate("/home", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
        setAccessToken(undefined);
        sessionStorage.removeItem(KEY_CURRENT_USER);
      }
    }

    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  const computeResult = (result: any) => {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 31);

    changeUser(result.user);

    sessionStorage.setItem(KEY_ACCESS_TOKEN, JSON.stringify(result.token));
    sessionStorage.setItem(KEY_EXPIRE_DATE, JSON.stringify(expireDate));
    sessionStorage.setItem(KEY_CURRENT_USER, JSON.stringify(result.user));

    setAccessToken(result.token);

    navigate("/home", { replace: true });
  };

  async function handleLogin(
    username: string,
    password: string
  ): Promise<void> {
    const result = await AuthService.login(username, password);
    computeResult(result);
  }

  async function handleLogout() {
    sessionStorage.removeItem(KEY_ACCESS_TOKEN);
    sessionStorage.removeItem(KEY_EXPIRE_DATE);
    sessionStorage.removeItem(KEY_CURRENT_USER);
    setAccessToken(undefined);
    changeUser(undefined);
    navigate("/login", { replace: true });
  }

  async function handleRegister(payload: IRegisterInterface) {
    const { email, password, name, phone, acceptUpdates } = payload;
    const result = await AuthService.register(
      email,
      password,
      name,
      phone,
      acceptUpdates
    );
    computeResult(result);
  }

  return (
    <AuthContext.Provider
      value={{
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        access_token: accessToken,
        set_access_token: setAccessToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
