import { set } from "dot-prop-immutable";

const createAxiosInterceptor = auth => async config => {
  const token = await auth.getIdToken();

  return token
    ? set(config, "headers.common.Authorization", `Bearer ${token}`)
    : config;
};

export default createAxiosInterceptor;
