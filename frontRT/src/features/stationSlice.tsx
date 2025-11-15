import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface Station {
    codeStation: number;
    name: string;
    type: string;
    startPk: number;
    endPk: number;
    userMatricule: string;
}

interface StationsState {
    stations: Station[];
    status: "loading" | "success" | "error";
}

const initialState: StationsState = {
    stations: [],
    status: "loading",
}

export const fetchStations = createAsyncThunk<Station[]>("/stations/fetchStations", async () => {
    const { data } = await axios.get("/api/stations");
    console.log("Response:", data);
    return data;
});

const stationsSlice = createSlice({
    name: "stations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStations.pending, (state) => {
                state.stations = []
                state.status = "loading"
            })
            .addCase(fetchStations.rejected, (state) => {
                state.stations = []
                state.status = "error"
            })
            .addCase(fetchStations.fulfilled, (state, action) => {
                state.stations = action.payload
                state.status = "success"
            })
    }
})

export default stationsSlice.reducer;
