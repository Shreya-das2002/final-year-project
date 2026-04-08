import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  appointmentRequestApi,
  getAppointmentsApi,
  getPendingAppointmentsApi,
  getSlotmanagementListApi,
} from "../../src/services/appointmentApi";

import type {
  Appointment,
  PendingAppointment,
  AppointmentRequestPayload,
  GetAppointmentsParams,
} from "../../src/services/appointmentApi";

interface AppointmentState {
  loading: boolean;
  slotLoading: boolean;
  appointments: Appointment[];
  pendingAppointments: PendingAppointment[];
  slotManagementList: Appointment[];
  bookedAppointment: Appointment | null;
  error: string | null;
}

const initialState: AppointmentState = {
  loading: false,
  slotLoading: false,
  appointments: [],
  pendingAppointments: [],
  slotManagementList: [],
  bookedAppointment: null,
  error: null,
};

/* ================= BOOK APPOINTMENT ================= */

export const bookAppointmentThunk = createAsyncThunk<
  Appointment,
  AppointmentRequestPayload,
  { rejectValue: string }
>(
  "appointment/bookAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await appointmentRequestApi(payload);

      if (!response.data?.success) {
        return rejectWithValue(
          response.data?.message || "Failed to book appointment"
        );
      }

      return response.data.data;
    } catch {
      return rejectWithValue("Failed to book appointment");
    }
  }
);

/* ================= GET APPOINTMENTS ================= */

export const fetchAppointmentsThunk = createAsyncThunk<
  Appointment[],
  GetAppointmentsParams | undefined,
  { rejectValue: string }
>(
  "appointment/fetchAppointments",
  async (params, { rejectWithValue }) => {
    try {
      return await getAppointmentsApi(params);
    } catch {
      return rejectWithValue("Failed to fetch appointments");
    }
  }
);

/* ================= GET PENDING ================= */

export const fetchPendingAppointmentsThunk = createAsyncThunk<
  PendingAppointment[],
  void,
  { rejectValue: string }
>(
  "appointment/fetchPendingAppointments",
  async (_, { rejectWithValue }) => {
    try {
      return await getPendingAppointmentsApi();
    } catch {
      return rejectWithValue("Failed to fetch pending appointments");
    }
  }
);

/* ================= GET SLOT MANAGEMENT LIST ================= */

export const fetchSlotManagementListThunk = createAsyncThunk<
  Appointment[],
  void,
  { rejectValue: string }
>(
  "appointment/fetchSlotManagementList",
  async (_, { rejectWithValue }) => {
    try {
      return await getSlotmanagementListApi();
    } catch {
      return rejectWithValue("Failed to fetch slot management list");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearBookedAppointment: (state) => {
      state.bookedAppointment = null;
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
    clearPendingAppointments: (state) => {
      state.pendingAppointments = [];
    },
    clearSlotManagementList: (state) => {
      state.slotManagementList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* BOOK */
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        bookAppointmentThunk.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.loading = false;
          state.bookedAppointment = action.payload;
          state.appointments.unshift(action.payload);
        }
      )
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* ALL APPOINTMENTS */
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAppointmentsThunk.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.appointments = action.payload;
        }
      )
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* PENDING */
      .addCase(fetchPendingAppointmentsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPendingAppointmentsThunk.fulfilled,
        (state, action: PayloadAction<PendingAppointment[]>) => {
          state.loading = false;
          state.pendingAppointments = action.payload;
        }
      )
      .addCase(fetchPendingAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      /* SLOT MANAGEMENT */
      .addCase(fetchSlotManagementListThunk.pending, (state) => {
        state.slotLoading = true;
      })
      .addCase(
        fetchSlotManagementListThunk.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.slotLoading = false;
          state.slotManagementList = action.payload;
        }
      )
      .addCase(fetchSlotManagementListThunk.rejected, (state, action) => {
        state.slotLoading = false;
        state.error = action.payload || null;
      });
  },
});

export const {
  clearAppointmentError,
  clearBookedAppointment,
  clearAppointments,
  clearPendingAppointments,
  clearSlotManagementList,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;