import type { AdminCustomer } from "@common/contexts";
import { adminMocks } from "../../common/mocks/admin.mocks";

let CUSTOMERS: AdminCustomer[] = [...adminMocks.customers];

export async function list(): Promise<AdminCustomer[]> {
  return new Promise((r) => setTimeout(() => r([...CUSTOMERS]), 200));
}
