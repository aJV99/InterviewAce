import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  firstName: string;
  lastName: string;
  accessToken: string | null;
}

const initialState: AuthState = {
  firstName: "",
  lastName: "",
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
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
      // localStorage.setItem("accessToken", action.payload.accessToken);
    },
    clearToken: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.accessToken = null;
      // localStorage.removeItem("token");
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      // localStorage.setItem("token", action.payload);
    },
  },
});

export const { loginSuccess, clearToken, updateToken } = authSlice.actions;
export default authSlice.reducer;
