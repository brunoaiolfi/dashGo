import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

export function createApi(ctx?: any) {
  const { "@dashGo:user": tempUser } = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://kiev:3334/",
  });

  const user = JSON.parse(tempUser ?? "{}");
  const { token } = user;
  
  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      toast.error(error?.response?.data.toString() ?? " ");
    }
  );
  return api;
}

export const api = createApi();
