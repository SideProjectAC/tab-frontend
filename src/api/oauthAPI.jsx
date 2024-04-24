import axios from "axios";

const api = axios.create({
  baseURL: "https://tabcolab.live/api/1.0",

  headers: {
    Authorization: `Bearer `,
  },
});

export function googleOauthAPI() {
  return api.get("/auth/google/token");
}
