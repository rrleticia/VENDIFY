import type { ActivityLog } from "../../common/contexts/admin/ActivityLogsContext";

let LOGS: ActivityLog[] = [];

export async function list(): Promise<ActivityLog[]> {
  return new Promise((r) =>
    setTimeout(
      () => r([...LOGS].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))),
      150
    )
  );
}
export function log(entry: Omit<ActivityLog, "id" | "timestamp">) {
  LOGS.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  });
}
