import { LogsService } from "@app/services";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ActivityLog = {
  id: string;
  timestamp: string;
  action: string;
  entityId?: string;
  details?: unknown;
  actor?: string;
};

type ActivityLogsContextType = {
  logs: ActivityLog[];
  refresh: () => Promise<void>;
};

const ActivityLogsContext = createContext<ActivityLogsContextType | undefined>(
  undefined
);

export function ActivityLogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const refresh = async () => {
    const data = await LogsService.list();
    setLogs(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(() => ({ logs, refresh }), [logs]);

  return (
    <ActivityLogsContext.Provider value={value}>
      {children}
    </ActivityLogsContext.Provider>
  );
}

export function useActivityLogs() {
  const ctx = useContext(ActivityLogsContext);
  if (!ctx)
    throw new Error("useActivityLogs must be used within ActivityLogsProvider");
  return ctx;
}
