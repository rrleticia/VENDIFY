import { CustomersService } from "@app/services";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orderCount: number;
};

type CustomersContextType = {
  customers: AdminCustomer[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const CustomersContext = createContext<CustomersContextType | undefined>(
  undefined
);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const data = await CustomersService.list();
    setCustomers(data);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ customers, loading, refresh }),
    [customers, loading]
  );

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx)
    throw new Error("useCustomers must be used within CustomersProvider");
  return ctx;
}
