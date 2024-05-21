import axios from "axios";

const token = localStorage.getItem("authToken");

const api = axios.create({
  baseURL: "https://tabcolab.live/api/1.0",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export async function postNoteAPI(group_id, newNoteData) {
  return api.post(`/groups/${group_id}/notes`, newNoteData);
}
