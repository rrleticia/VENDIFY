// src/services/api/ProfileService.ts
import type { User, Address, Card } from "./types";
import { mockUser, mockAddresses, mockCards } from "@common/mocks";

type Store = { user: User; addresses: Address[]; cards: Card[] };

// mock in-memory (troque por chamadas reais)
let DB: Store = { user: mockUser, addresses: mockAddresses, cards: mockCards };

export async function getProfile(): Promise<Store> {
  return DB;
}
export async function updateUser(patch: Partial<User>): Promise<Store> {
  DB = { ...DB, user: { ...DB.user, ...patch } };
  return DB;
}
export async function upsertAddress(a: Address): Promise<Store> {
  const exists = DB.addresses.some((x) => x.id === a.id);
  const next = exists
    ? DB.addresses.map((x) => (x.id === a.id ? a : x))
    : [...DB.addresses, a];
  if (a.isDefault) next.forEach((x) => (x.isDefault = x.id === a.id));
  DB = { ...DB, addresses: next };
  return DB;
}
export async function removeAddress(id: string): Promise<Store> {
  DB = { ...DB, addresses: DB.addresses.filter((x) => x.id !== id) };
  return DB;
}
export async function upsertCard(c: Card): Promise<Store> {
  const exists = DB.cards.some((x) => x.id === c.id);
  const next = exists
    ? DB.cards.map((x) => (x.id === c.id ? c : x))
    : [...DB.cards, c];
  if (c.isDefault) next.forEach((x) => (x.isDefault = x.id === c.id));
  DB = { ...DB, cards: next };
  return DB;
}
export async function removeCard(id: string): Promise<Store> {
  DB = { ...DB, cards: DB.cards.filter((x) => x.id !== id) };
  return DB;
}
export async function changePassword(_oldPass: string, _newPass: string) {
  return true;
}
export async function deleteAccount() {
  return true;
}
