// import axios, { AxiosError } from 'axios';
// import store, { persistor } from '../redux/store';
// import { updateToken, clearToken } from '../redux/features/authSlice';

// const instance = axios.create({
//   baseURL: process.env.BACKEND_BASE_URL,
//   withCredentials: true,
// });

// instance.interceptors.request.use(
//   (config) => {
//     const state = store.getState();

//     // It's crucial to check for both state and state.auth to avoid potential TypeErrors.
//     if (state && state.auth && state.auth.accessToken) {
//       config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     console.error('The error:' + error);
//     return Promise.reject(error);
//   },
// );

// instance.interceptors.response.use(
//   (response) => {
//     console.log('Interceptor Triggered:', response);
//     console.log('Header', response.headers);
//     if (response.headers['authorization']) {
//       console.log('Hello' + response.headers['authorization']);
//       const newJwt = response.headers['authorization'].split(' ')[2];
//       store.dispatch(updateToken(newJwt));
//     }
//     return response;
//   },
//   (error: AxiosError) => {
//     console.log('Entire Error:', error.message);
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       error.config &&
//       error.config.url &&
//       error.config.url === '/auth/login'
//     ) {
//       store.dispatch(clearToken());
//       persistor.purge();
//     }
//     console.error('Axios Error:', error);
//     return Promise.reject(error);
//   },
// );

// export default instance;

import axios, { AxiosError } from 'axios';

// Removed direct store imports at the top level to avoid circular dependencies
// import store, { persistor } from '../redux/store';
// import { updateToken, clearToken } from '../redux/features/authSlice';

const instance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config) => {
    // Import store dynamically to ensure it's fully initialized
    const { default: store } = await import('../redux/store');

    const state = store.getState();

    if (state && state.auth && state.auth.accessToken) {
      config.headers.Authorization = `Bearer ${state.auth.accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error('The error:' + error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  async (response) => {
    if (response.headers['authorization']) {
      const newJwt = response.headers['authorization'].split(' ')[2];

      // Dynamically import to avoid circular dependencies
      const { updateToken } = await import('@/redux/features/authSlice');
      const { default: store } = await import('@/redux/store');
      store.dispatch(updateToken(newJwt));
    }
    return response;
  },
  async (error: AxiosError) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config &&
      error.config.url &&
      error.config.url === '/auth/login'
    ) {
      // Dynamically import to avoid circular dependencies
      const { clearToken } = await import('@/redux/features/authSlice');
      const { default: store, persistor } = await import('@/redux/store');
      store.dispatch(clearToken());
      persistor.purge();
    }
    console.error('Axios Error:', error);
    return Promise.reject(error);
  },
);

export default instance;
