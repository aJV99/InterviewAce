import axios, { AxiosError } from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000, // Timeout after 30000 ms (30 seconds)
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
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  async (response) => {
    if (response.headers['authorization']) {
      const newJwt = response.headers['authorization'].split(' ')[2];

      // Dynamically imported to avoid circular dependencies
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
      // Dynamically imported to avoid circular dependencies
      const { clearToken } = await import('@/redux/features/authSlice');
      const { default: store, persistor } = await import('@/redux/store');
      store.dispatch(clearToken());
      persistor.purge();
    }
    return Promise.reject(error);
  },
);

export default instance;
