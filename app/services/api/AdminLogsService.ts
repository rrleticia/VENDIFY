// app/services/api/AdminLogsService.ts
import { adminActivityLogs, adminEmailQueue } from "@common/mocks_admin";

const wait = (ms:number)=> new Promise(r=>setTimeout(r, ms));

export async function listActivity() {
  await wait(80);
  return [...adminActivityLogs].sort((a,b)=> (a.at < b.at ? 1 : -1));
}

export async function listEmailQueue() {
  await wait(80);
  return [...adminEmailQueue].sort((a,b)=> (a.at < b.at ? 1 : -1));
}
