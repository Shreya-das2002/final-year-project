import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createDoctorApi } from "../../src/services/doctorApi";
import type { RootState } from "../store";


/* ================= DOCTOR TYPE ================= */

interface Doctor {

  doctor_id: number;

  first_name: string;
  middle_name?: string | null;

  last_name: string;

  email: string;

  phone_no: string;

  status: string;

}


/* ================= DOCTOR STATE ================= */

interface DoctorState {

  doctors: Doctor[];

  loading: boolean;

}


/* ================= INITIAL STATE ================= */

const initialState: DoctorState = {

  doctors: [],

  loading: false,

};


/* ================= CREATE PAYLOAD TYPE ================= */

interface CreateDoctorPayload {

  first_name: string;
  middle_name?: string;

  last_name: string;

  email: string;

  phone_no: string;

  gender: number;

  specialization: number;

  password: string;

  confirm_password: string;

}


/* ================= THUNK ================= */

export const createDoctorThunk = createAsyncThunk<Doctor, CreateDoctorPayload>(

  "doctor/create",

  async (payload, { rejectWithValue }) => {

    try {

      const response = await createDoctorApi(payload);

      if (response.data.success) {

        return response.data.data;

      }

      return rejectWithValue(response.data.message);

    } catch (error: unknown) {

      if (error instanceof Error) {

        return rejectWithValue(error.message);

      }

      return rejectWithValue("Failed to create doctor");

    }

  },

  {
    condition: (_, { getState }) => {

      const state = getState() as RootState;

      if (state.doctor.loading) return false;

      return true;

    }

  }

);


/* ================= SLICE ================= */

const doctorSlice = createSlice({

  name: "doctor",

  initialState,

  reducers: {

    addDoctor(state, action: PayloadAction<Doctor>) {

      state.doctors.push(action.payload);

    },

    setDoctors(state, action: PayloadAction<Doctor[]>) {

      state.doctors = action.payload;

    },

    clearDoctors(state) {

      state.doctors = [];

    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(createDoctorThunk.pending, (state) => {

        state.loading = true;

      })

      .addCase(

        createDoctorThunk.fulfilled,

        (state, action: PayloadAction<Doctor>) => {

          state.loading = false;

          state.doctors.push(action.payload);

        }

      )

      .addCase(createDoctorThunk.rejected, (state) => {

        state.loading = false;

      });

  },

});


/* ================= EXPORTS ================= */

export const {

  addDoctor,

  setDoctors,

  clearDoctors

} = doctorSlice.actions;


export default doctorSlice.reducer;
