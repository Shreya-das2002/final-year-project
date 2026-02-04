import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllAdminsApi } from "../../src/services/createAdminApi";
import type { RootState } from "../store";

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
  loading: boolean;
}

/* ================= INITIAL STATE ================= */

const initialState: AdminState = {
  admins: [],
  loading: false,
};

//  THIS IS WHERE fetchAllAdmins GOES
export const fetchAllAdmins = createAsyncThunk(
  "admin/alladmins",
  async () => {
    return await getAllAdminsApi();
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;

      // 🚫 Block ONLY if a request is already in progress
      if (state.admin.loading) {
        return false;
      }

      return true;
    },
  }
);

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

// 👇 HANDLE API RESPONSE HERE
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAllAdmins.rejected, (state) => {
        state.loading = false;
      });
  },
});

/* ================= EXPORTS ================= */

export const {
  addAdmin,
  setAdmins,
  clearAdmins,
} = adminSlice.actions;

export default adminSlice.reducer;
