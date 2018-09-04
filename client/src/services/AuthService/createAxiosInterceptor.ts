import { AxiosRequestConfig } from "axios";
import { set } from "object-immutable-set";
import AuthService from "./AuthService";

type AxiosInterceptor<V> = (config: V) => V | Promise<V>;

const createAxiosInterceptor = (
  auth: AuthService
): AxiosInterceptor<AxiosRequestConfig> => async config => {
  const token = await auth.getIdToken();

  if (token === null) {
    return config;
  }

  return set(config, ["headers", "common", "Authorization"], `Bearer ${token}`);
};

export default createAxiosInterceptor;
