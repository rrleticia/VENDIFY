// src/services/api/AuthService.ts
import { loadJSON, saveJSON, STORAGE_KEYS } from "@services/helpers/storage";
import type { UserType } from "@common/types/UserType";

export interface IRegisterInterface {
  name: string;
  email: string;
  phone: string;
  password: string;
  acceptUpdates?: boolean;
}

type StoredUser = UserType & { password: string };

function getUsers(): StoredUser[] {
  return loadJSON<StoredUser[]>(STORAGE_KEYS.users, []);
}

function setUsers(list: StoredUser[]) {
  saveJSON(STORAGE_KEYS.users, list);
}

function makeToken(): string {
  return Math.random().toString(36).slice(2) + "." + Math.random().toString(36).slice(2);
}

export async function register(
  email: string,
  password: string,
  name: string,
  phone: string,
  acceptUpdates?: boolean
) {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error("E-mail já cadastrado.");
  }
  const newUser: StoredUser = {
    name,
    email,
    phone,
    password,
    cpf: "",
    birth: "",
    avatar: undefined,
    newsletter: !!acceptUpdates,
    twoFA: false,
    marketingPush: !!acceptUpdates,
    marketingEmail: !!acceptUpdates,
  };
  users.push(newUser);
  setUsers(users);

  // login automático após cadastro
  const token = makeToken();
  return {
    ok: true,
    token,
    user: { ...newUser, password: undefined as any } as UserType,
  };
}

export async function signIn(email: string, password: string) {
  const users = getUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) {
    throw new Error("Credenciais inválidas.");
  }
  const token = makeToken();
  const { password: _pwd, ...safe } = found;
  return { ok: true, token, user: safe as UserType };
}

export async function signOut() {
  return { ok: true };
}

export async function me() {
  // Em um backend real, leria do token. Aqui, retornamos um mock simples.
  return { name: "Usuário", email: "user@example.com" };
}

export const login = signIn;