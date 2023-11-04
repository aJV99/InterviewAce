import axios, { AxiosError } from "axios";
import store, { persistor } from "../redux/store";
import { updateToken, clearToken } from "../redux/features/authSlice";

const instance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const state = store.getState();

    // It's crucial to check for both state and state.auth to avoid potential TypeErrors.
    if (state && state.auth && state.auth.accessToken) {
      config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error("The error:" + error);
    return Promise.reject(error);
  },
);

// instance.interceptors.request.use(config => {
//   const state = store.getState();
//   const token = state.auth.token;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   Access-Control-Allow-Origin: http://localhost:3000

//   config.headers

//   return config;
// }, error => {
//   return Promise.reject(error);
// });

instance.interceptors.response.use(
  (response) => {
    console.log("Interceptor Triggered:", response);
    console.log("Header", response.headers);
    if (response.headers["authorization"]) {
      console.log("Hello" + response.headers["authorization"]);
      const newJwt = response.headers["authorization"].split(" ")[2];
      store.dispatch(updateToken(newJwt));
    }
    return response;
  },
  (error: AxiosError) => {
    console.log("Entire Error:", error.message);
    if (error.response && error.response.status === 401) {
      console.log("Hello");
      store.dispatch(clearToken());
      persistor.purge();
    }
    console.error("Axios Error:", error);
    return Promise.reject(error);
  },
);

export default instance;
