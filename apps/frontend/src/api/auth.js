import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:4000" });

export async function registerUser(fullName, email, password) {
  const { data } = await api.post("/auth/register", {
    fullName,
    email,
    password,
    buildingId: 1,
  });
  return data;
}

export async function loginUser(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function getMe(token) {
  const { data } = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
