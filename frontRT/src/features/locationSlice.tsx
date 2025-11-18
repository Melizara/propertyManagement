import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface Location {
    codeLocation?: number;
    cin: string;
    codeLand: number,
    usage: string,
    areaLandBare: number,
    areaWood: number,
    areaPermanent: number,
    priceLandBare: number,
    priceWood: number,
    pricePermanent: number,
    typePayment: string,
    methodPayment: string,
    placePaymment: string,
    userMatricule: string;
}

interface LocationsState {
    locations: Location[],
    status: "loading" | "success" | "error";
}

const initialState: LocationsState = {
    locations: [],
    status: "loading",
}

export const fetchLocations = createAsyncThunk<Location[]>("/locations/fetchLocations", async () => {
    const { data } = await axios.get("/api/locations");
    console.log("Response", data);
    return data;

});

export const deleteLocation = createAsyncThunk<void, number>(
    "/locations/deleteLocation",
    async (codeLocation) => {
        await axios.delete(`/api/locations/${codeLocation}`)
    }
)

const locationsSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLocations.pending, (state) => {
                state.locations = []
                state.status = "loading"
            })
            .addCase(fetchLocations.rejected, (state) => {
                state.locations = []
                state.status = "error"
            })
            .addCase(fetchLocations.fulfilled, (state, action) => {
                state.locations = action.payload
                state.status = "success"
            })
            .addCase(deleteLocation.pending, (state, action) => {
                state.locations = state.locations.filter((location) => location.codeLocation !== action.meta.arg)

            })
    }
});


export default locationsSlice.reducer;