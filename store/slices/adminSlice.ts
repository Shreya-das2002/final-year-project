import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/* ================= ADMIN TYPES ================= */

interface Admin {
  admin_user_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone_no: string;
  gender: number | null;
  user_type: number;
  status?: string;
}

/* ================= ADMIN STATE ================= */

interface AdminState {
  admins: Admin[];
}

/* ================= INITIAL STATE ================= */

const initialState: AdminState = {
  admins: [],
};

/* ================= SLICE ================= */

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addAdmin(
      state,
      action: PayloadAction<Admin>
    ) {
      state.admins.push(action.payload);
    },

    setAdmins(
      state,
      action: PayloadAction<Admin[]>
    ) {
      state.admins = action.payload;
    },

    clearAdmins(state) {
      state.admins = [];
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  addAdmin,
  setAdmins,
  clearAdmins,
} = adminSlice.actions;

export default adminSlice.reducer;
