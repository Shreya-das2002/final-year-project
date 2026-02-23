import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createDoctorApi, getDoctorListApi } from "../../src/services/doctorApi";
import type { RootState } from "../store";


/* ================= DOCTOR TYPE ================= */



interface Address {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  pin: string | null;

}
interface Doctor {

  doctor_id: number;

  first_name: string;
  middle_name?: string | null;
  last_name: string;
  dob?: string | null;


  email: string;
  phone_no: string;

  gender?: string;    
  doctor_no?: string;
  license_no?: string;
  experience?: number;      
  specialization?: string;
  bio?: string;  
  status: string;
 
  current_address: Address | null;
  permanent_address: Address | null;

  

  created_on?: string;



}



interface Experience {
  organization_name: string | null;
  designation: string | null;
  start_date: string | null;
  end_date: string | null;
  responsibilities: string | null;
}

/* ================= DOCTOR STATE ================= */

interface DoctorState {
  doctors: Doctor[];
  experiences: Experience[];
  loading: boolean;
  selectedDoctor: Doctor | null; // ✅ ADD THIS
}

const initialState: DoctorState = {
  doctors: [],
  experiences: [],
  loading: false,
  selectedDoctor: null,
};


/* ================= INITIAL STATE ================= */

const initialState: DoctorState = {

  doctors: [],

  experiences: [],

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


/* ================= CREATE DOCTOR THUNK ================= */

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


/* ================= FETCH DOCTOR LIST THUNK ================= */

export const fetchDoctorListThunk = createAsyncThunk<
  Doctor[],
  number | undefined,
  { rejectValue: string }
>(
  "doctor/doctor-list",
  async (specializationId, { rejectWithValue }) => {
    try {
      const res = await getDoctorListApi(specializationId);

      return res; // ✅ FIXED (already Doctor[])
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch doctors");
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

      /* CREATE DOCTOR */

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

      })


      /* FETCH DOCTOR LIST */

      .addCase(fetchDoctorListThunk.pending, (state) => {

        state.loading = true;

      })

      .addCase(

        fetchDoctorListThunk.fulfilled,

        (state, action: PayloadAction<Doctor[]>) => {

          state.loading = false;

          state.doctors = action.payload;

        }

      )

      .addCase(fetchDoctorListThunk.rejected, (state) => {

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
