import { configureStore } from "@reduxjs/toolkit";
//Reducer qui gère toute ce qui est authentification
import authReducer from "../features/authSlice";
//Reducer qui gère les stories
import storiesReducer from "../features/storySlice";


const Store = configureStore({
    reducer: {
        auth: authReducer,
        stories:storiesReducer
    }
});

//Typage ts anle RootState
export type RootState = ReturnType<typeof Store.getState>;

//Typage ts anle AppDispatch iny
export type AppDispatch = typeof Store.dispatch;

export default Store;