import dotProp from "dot-prop-immutable";

const createAxiosInterceptor = auth => async config => {
  const token = await auth.getIdToken();

  return token
    ? dotProp.set(config, "headers.common.Authorization", `Bearer ${token}`)
    : dotProp.delete(config, "headers.common.Authorization");
};

export default createAxiosInterceptor;
