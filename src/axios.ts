import axios from "axios";
import { localStoreKeys } from "./constants";
import { User } from "./types/user";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
});

export const setUpInterceptors = () => {
  axiosClient.interceptors.request.use(
    (request) => {
      const storeString = localStorage.getItem(localStoreKeys.store);
      const user: User | null = storeString
        ? JSON.parse(storeString).state.user
        : null;

      request!.headers!["Authorization"] =
        `Bearer ${user ? user.accessToken : "No token"}`;
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;
      if (error.response && originalConfig.url !== "/staff/signin") {
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const storeString = localStorage.getItem(localStoreKeys.store);
            const user: User | null = storeString
              ? JSON.parse(storeString).state.user
              : null;

            if (!user) {
              return Promise.reject(error);
            }

            const res = await axiosClient.post("/staff/refresh", {
              refreshToken: user.refreshToken,
            });
            const { accessToken } = res.data;
            localStorage.setItem(
              localStoreKeys.store,
              JSON.stringify({ state: { user: { ...user, accessToken } } })
            );

            return axiosClient(originalConfig);
          } catch (error) {
            return Promise.reject(error);
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
