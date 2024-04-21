import axiosInstance from '@/app/axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserDto } from '@/redux/dto/user.dto';
import axios from 'axios';

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

export const forgot = async (email: string) => {
  const response = await axiosInstance.post('/auth/forgot', { email });
  return response.data;
};

export const reset = async (email: string, token: string, password: string) => {
  const response = await axiosInstance.post('/auth/reset', { email, token, password });
  return response.data;
};

export const getUser = createAsyncThunk<UserDto>('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/user');
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateUser = createAsyncThunk<UserDto, UserDto, { rejectValue: Error }>(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/user', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as Error);
      } else {
        return rejectWithValue(new Error('An unknown error occurred'));
      }
    }
  },
);

export const updatePassword = createAsyncThunk<UserDto, { currentPassword: string; newPassword: string }>(
  'auth/updatePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/user/password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as Error);
      } else {
        return rejectWithValue(new Error('An unknown error occurred'));
      }
    }
  },
);

export const deleteUser = createAsyncThunk<void>('auth/deleteUser', async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.delete('/user');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as Error);
    } else {
      return rejectWithValue(new Error('An unknown error occurred'));
    }
  }
});

export interface AuthState {
  firstName: string;
  lastName: string;
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  firstName: '',
  lastName: '',
  user: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action: PayloadAction<UserDto>) => {
        const { firstName, lastName, ...result } = action.payload;
        state.firstName = firstName;
        state.lastName = lastName;
        state.user = result;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserDto>) => {
        const { firstName, lastName, ...result } = action.payload;
        state.firstName = firstName;
        state.lastName = lastName;
        state.user = result;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { loginSuccess, clearToken, updateToken } = authSlice.actions;
export default authSlice.reducer;
