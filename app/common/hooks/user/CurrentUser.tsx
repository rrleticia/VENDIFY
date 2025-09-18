import { useState } from "react";
import type { UserType } from "@common/types/UserType";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<UserType | undefined>();

  const handleUserChange = (value: UserType | undefined) => {
    setCurrentUser(value);
  };

  return {
    currentUser,
    handleUserChange,
  };
};
