import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  withCredentials: true,
});

export const setUpInterceptors = () => {
  axiosClient.interceptors.request.use(
    (request) => {
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
            await axiosClient.post("/staff/refresh");
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
