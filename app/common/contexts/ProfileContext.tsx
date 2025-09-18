import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useUserContext } from "./UserContext";
import type {
  AddressType,
  AvatarType,
  UserOrdersInfoType,
  UserType,
} from "@common/types/UserType";

interface IProfileContextProps {
  user: UserType | undefined;
  avatar: AvatarType | undefined;
  userOrdersInfo: UserOrdersInfoType | undefined;
  addresses: AddressType[] | undefined;
}

const ProfileContext = createContext<IProfileContextProps | undefined>(
  {} as IProfileContextProps
);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext();

  const [avatar, setAvatar] = useState<AvatarType | undefined>();
  const [userOrdersInfo, setUserOrdersInfo] = useState<
    UserOrdersInfoType | undefined
  >();
  const [addresses, setAddresses] = useState<AddressType[] | undefined>();

  return (
    <ProfileContext.Provider
      value={{ user, avatar, userOrdersInfo, addresses }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
