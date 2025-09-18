import { createContext, useContext, type ReactNode } from "react";

interface IPlaceholderContextProps {}

const PlaceholderContext = createContext<IPlaceholderContextProps | undefined>(
  {} as IPlaceholderContextProps
);

export const PlaceholderProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PlaceholderContext.Provider value={{}}>
      {children}
    </PlaceholderContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(PlaceholderContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
