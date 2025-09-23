// src/services/api/AuthService.ts
import { API_URL } from "../func/config";

export async function signIn(_email: string, _password: string) {
  // mock simples
  return { ok: true, token: "mock-token" };
}

export async function signOut() {
  return { ok: true };
}
export async function me() {
  return { name: "Letícia Andrade", email: "leticia@example.com" };
}

export interface ILoginInterface {
  email: string;
  password: string;
}

export interface IRegisterInterface {
  email: string;
  password: string;
  name: string;
  phone: string;
  acceptUpdates: boolean;
}

export async function login(email: string, password: string) {
  return {
    token: "TOKEN_123",
    user: {
      name: "Leticia",
      email: "leticia@gmail.com",
      phone: "+55839999999999",
      cpf: "99999999999",
      birthdate: "21/09/1001",
    },
  };

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log(response);

  if (!response.ok) {
    throw new Error("Falha no login");
  }

  return response.json();
}

export async function register(
  email: string,
  password: string,
  name: string,
  phone: string,
  acceptUpdates: boolean
) {
  return {
    token: "TOKEN_123",
    user: {
      name: "Leticia",
      email: "leticia@gmail.com",
      phone: "+55839999999999",
      cpf: "99999999999",
      birthdate: "21/09/1001",
    },
  };

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, phone, acceptUpdates }),
  });

  if (!response.ok) {
    throw new Error("Falha no cadastro");
  }

  return response.json(); // Retorna confirmação ou token
}
