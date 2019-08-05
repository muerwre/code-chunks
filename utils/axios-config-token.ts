export const configWithToken = (
  access: string,
  config: AxiosRequestConfig = {}
): AxiosRequestConfig => ({
  ...config,
  headers: { ...(config.headers || {}), Authorization: `Bearer ${access}` }
});
