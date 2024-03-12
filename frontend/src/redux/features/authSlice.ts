import axiosInstance from '@/app/axios'; // path to your axios.ts file
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (firstName: string, lastName: string, email: string, password: string) => {
  const response = await axiosInstance.post('/auth/signup', {
    firstName,
    lastName,
    email,
    password,
  });
  return response.data;
};

export interface AuthState {
  firstName: string;
  lastName: string;
  accessToken: string | null;
}

const initialState: AuthState = {
  firstName: '',
  lastName: '',
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        accessToken: string;
      }>,
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.accessToken = action.payload.accessToken;
    },
    clearToken: (state) => {
      state.firstName = '';
      state.lastName = '';
      state.accessToken = null;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { loginSuccess, clearToken, updateToken } = authSlice.actions;
export default authSlice.reducer;
