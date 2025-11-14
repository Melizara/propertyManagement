import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface Land {
    codeLand: number;
    length: number;
    width: number;
    area: number;
    startPk: number;
    endPk: number;
    railwaySide: "gauche" | "droite";
    position: string;
    neighborHood: string;
    municipality: string;
    userMatricule: string;
}

interface LandsState {
    lands: Land[];
    status: "loading" | "success" | "error";
}

const initialState: LandsState = {
    lands: [],
    status: "loading",
};

export const fetchLands = createAsyncThunk<Land[]>("/lands/fetchlands", async () => {
    const { data } = await axios.get("/api/lands");
    console.log("Response:", data);
    return data;
})

export const deleteLand = createAsyncThunk<void, number>(
    "/tenants/deleteLand",
    async (codeLand) => {
        await axios.delete(`/api/lands/${codeLand}`);
    }
);

const landsSlice = createSlice({
    name: "lands",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLands.pending, (state) => {
                state.lands = []
                state.status = "loading"
            })
            .addCase(fetchLands.rejected, (state) => {
                state.lands = []
                state.status = "error"
            })
            .addCase(fetchLands.fulfilled, (state, action) => {
                state.lands = action.payload
                state.status = "success"
            })
            .addCase(deleteLand.pending, (state, action) => {
                state.lands = state.lands.filter((land) => land.codeLand !== action.meta.arg)

            })
    }
});

export default landsSlice.reducer;