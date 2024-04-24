import axios from "axios";

const api = axios.create({
  baseURL: "https://tabcolab.live/api/1.0",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getGroupAPI() {
  return api.get("/groups");
}

export function postGroupAPI(newGroupData) {
  return api.post("/groups", newGroupData);
}

export function patchGroupAPI(groupId, updateData) {
  return api.patch(`/groups/${groupId}`, updateData);
}

export function deleteGroupAPI(groupId) {
  return api.delete(`/groups/${groupId}`);
}
