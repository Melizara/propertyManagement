import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"
const Store = configureStore({
    reducer: {
        auth: authReducer
    }
});

// 🔹 Typage du state global
export type RootState = ReturnType<typeof Store.getState>;

// 🔹 Typage du dispatch (important pour les thunks)
export type AppDispatch = typeof Store.dispatch;

export default Store;