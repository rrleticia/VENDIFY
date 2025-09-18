import { createContext, useContext, type ReactNode } from "react";

interface IProfileContextProps {}

const ProfileContext = createContext<IProfileContextProps | undefined>(
  {} as IProfileContextProps
);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ProfileContext.Provider value={{}}>{children}</ProfileContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
