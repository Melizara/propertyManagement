import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";//Reducer qui gère toute ce qui est authentification
import storiesReducer from "../features/storySlice";//Reducer qui gère les stories
import tenantsReducer from "../features/tenantSlice";

const Store = configureStore({
    reducer: {
        auth: authReducer,
        stories: storiesReducer,
        tenants: tenantsReducer
    }
});

export type RootState = ReturnType<typeof Store.getState>;//Typage ts anle RootState

export type AppDispatch = typeof Store.dispatch;//Typage ts anle AppDispatch iny

export default Store;