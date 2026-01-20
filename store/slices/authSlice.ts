import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

interface User {
  email: string;
  role: string;
  patient_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_no: string;
  gender: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  role: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<any>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
