import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface Price {
    codePrice: number;
    secteur: string;
    usage: string;
    sousUsage: string;
    prix: number;
    userMatricule: string;
}

interface PricesState {
    prices: Price[];
    status: "loading" | "success" | "error";
}

const initialState: PricesState = {
    prices: [],
    status: "loading",
}

// Fetch tous les prix depuis l'API
export const fetchPrices = createAsyncThunk<Price[]>(
    "/prices/fetchPrices",
    async () => {
        const { data } = await axios.get("/api/prices");
        console.log("Response:", data);
        return data;
    }
);

const pricesSlice = createSlice({
    name: "prices",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrices.pending, (state) => {
                state.prices = [];
                state.status = "loading";
            })
            .addCase(fetchPrices.rejected, (state) => {
                state.prices = [];
                state.status = "error";
            })
            .addCase(fetchPrices.fulfilled, (state, action) => {
                state.prices = action.payload;
                state.status = "success";
            })
    }
});

export default pricesSlice.reducer;
