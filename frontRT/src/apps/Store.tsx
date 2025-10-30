import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import storiesReducer from "../features/storySlice";


const Store = configureStore({
    reducer: {
        auth: authReducer,
        stories:storiesReducer
    }
});

// 🔹 Typage du state global
export type RootState = ReturnType<typeof Store.getState>;

// 🔹 Typage du dispatch (important pour les thunks)
export type AppDispatch = typeof Store.dispatch;

export default Store;