import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";//Reducer qui gère toute ce qui est authentification
import storiesReducer from "../features/storySlice";//Reducer qui gère les stories
import tenantsReducer from "../features/tenantSlice";
import stationReducer from "../features/stationSlice";
import landReducer from "../features/landSlice";
import priceReducer from "../features/priceSlice";

const Store = configureStore({
    reducer: {
        auth: authReducer,
        stories: storiesReducer,
        tenants: tenantsReducer,
        lands: landReducer,//ity nokitihako rag misy blem ny terrain
        stations: stationReducer,
        prices:priceReducer
    }
});

export type RootState = ReturnType<typeof Store.getState>;//Typage ts anle RootState

export type AppDispatch = typeof Store.dispatch;//Typage ts anle AppDispatch iny

export default Store;