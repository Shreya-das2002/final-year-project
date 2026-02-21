import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import doctorReducer from "./slices/doctorSlice"; 


export const store = configureStore({

  reducer: {

    auth: authReducer,

    admin: adminReducer,

    doctor: doctorReducer,   //  ADD THIS

  },

});


/* ================= TYPES ================= */

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
