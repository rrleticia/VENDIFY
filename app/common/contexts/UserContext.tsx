import { useCurrentUser } from "@common/hooks/user";
import type { UserType } from "@common/types/UserType";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface IUserContextProps {
  loginStatus: boolean;
  user: UserType | undefined;
  changeUser: (user: UserType | undefined) => void;
}

const UserContext = createContext<IUserContextProps | undefined>(
  {} as IUserContextProps
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  const { currentUser, handleUserChange } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      setLoginStatus(true);
    } else setLoginStatus(false);
  }, [currentUser, handleUserChange]);

  return (
    <UserContext.Provider
      value={{ loginStatus, user: currentUser, changeUser: handleUserChange }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
