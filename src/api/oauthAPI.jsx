import axios from "axios";

const api = axios.create({
  baseURL: "https://tabcolab.live/api/1.0",

  headers: {
    Authorization: `Bearer `,
  },
});

export function googleOauthAPI(token) {
  return api.post("/oauth/google/token", token);
}
