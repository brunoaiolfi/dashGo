import { parseCookies } from "nookies";
import axios from "axios";

const cookies = parseCookies();

export const api2 = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["@dashGo:token"]}`,
  },
});
