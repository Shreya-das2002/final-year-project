import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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

interface Menu {
  control_master_id: number;
  control_type: string;
  control_key: string;
  control_name: string;
  control_desc: string | null;
  status: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  menus: Menu[];
}

/* ================= PAYLOAD ================= */

interface LoginSuccessPayload {
  token: string;
  user: User;
  role: string;
  menus: Menu[];
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  token: null,
  user: null,
  role: null,
  isAuthenticated: false,
  menus: []
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<LoginSuccessPayload>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.menus = action.payload.menus;
      state.isAuthenticated = true;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.role = null;
      state.menus = [];
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
