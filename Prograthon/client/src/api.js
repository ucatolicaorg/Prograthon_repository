// client/src/api.js

const BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, opts = {}) {
  const res = await fetch(BASE + path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message);
  }
  return res.json();
}

const auth = {
  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
};

const users = {
  list: () => request("/users"),
  me: () => request("/users/me"),
  get: (id) => request(`/users/${id}`),
  update: (id, data) =>
    request(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/users/${id}`, {
      method: "DELETE",
    }),
};

const maratones = {
  create: (data) =>
    request("/maratones", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  list: () => request("/maratones"),
  get: (id) => request(`/maratones/${id}`),
  // Problemas asignados a maratón
  assignProblemas: (maratonId, problemasArray) =>
    request(`/maratones/${maratonId}/problemas`, {
      method: "PATCH",
      body: JSON.stringify({ problemas: problemasArray }),
    }),
  getProblemasDeMaraton: (maratonId) =>
    request(`/maratones/${maratonId}/problemas`),
  removeProblemaDeMaraton: (maratonId, problemaId) =>
    request(`/maratones/${maratonId}/problemas/${problemaId}`, {
      method: "DELETE",
    }),
  // —— MÉTODOS PARA PARTICIPANTES —— 
  inscribir: (maratonId) =>
    request(`/maratones/${maratonId}/inscribir`, {
      method: "PATCH",
    }),
  getParticipantesDeMaraton: (maratonId) =>
    request(`/maratones/${maratonId}/participantes`),
  removeParticipanteDeMaraton: (maratonId, userId) =>
    request(`/maratones/${maratonId}/participantes/${userId}`, {
      method: "DELETE",
    }),
};

const problemas = {
  create: (data) =>
    request("/problemas", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  list: () => request("/problemas"),
  get: (id) => request(`/problemas/${id}`),
};

export const register = auth.register;
export const login = auth.login;
export const logout = auth.logout;
export const getCurrentUser = users.me;
export { users, maratones, problemas };
