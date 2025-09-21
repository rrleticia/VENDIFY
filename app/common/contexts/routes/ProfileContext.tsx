import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Address, Card, User } from "@common/types";
import {
  getProfile,
  updateUser,
  upsertAddress,
  removeAddress,
  upsertCard,
  removeCard,
  changePassword,
  deleteAccount,
} from "@services/api/ProfileService";

type Store = { user: User; addresses: Address[]; cards: Card[] };

interface ProfileCtx {
  store: Store | null;
  loading: boolean;
  refresh: () => Promise<void>;
  saveUser: (patch: Partial<User>) => Promise<void>;
  saveAddress: (a: Address) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  saveCard: (c: Card) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const Ctx = createContext<ProfileCtx | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setStore((await getProfile()) as Store);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveUser = useCallback(async (patch: Partial<User>) => {
    setLoading(true);
    try {
      setStore((await updateUser(patch)) as Store);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAddress = useCallback(async (a: Address) => {
    setLoading(true);
    try {
      setStore((await upsertAddress(a)) as Store);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setStore((await removeAddress(id)) as Store);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCard = useCallback(async (c: Card) => {
    setLoading(true);
    try {
      setStore((await upsertCard(c)) as Store);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setStore((await removeCard(id)) as Store);
    } finally {
      setLoading(false);
    }
  }, []);

  const doChangePassword = useCallback(
    async (oldP: string, newP: string) => changePassword(oldP, newP),
    []
  );
  const doDeleteAccount = useCallback(async () => deleteAccount(), []);

  const value = useMemo<ProfileCtx>(
    () => ({
      store,
      loading,
      refresh,
      saveUser,
      saveAddress,
      deleteAddress,
      saveCard,
      deleteCard,
      changePassword: doChangePassword,
      deleteAccount: doDeleteAccount,
    }),
    [
      store,
      loading,
      refresh,
      saveUser,
      saveAddress,
      deleteAddress,
      saveCard,
      deleteCard,
      doChangePassword,
      doDeleteAccount,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfile() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useProfile deve ser usado dentro de ProfileProvider");
  return ctx;
}
