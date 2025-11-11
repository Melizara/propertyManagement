import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface Tenant {
    name: string;
    lastName: string;
    birthDate: string;
    birthPlace: string;
    cin: number;
    cinPlace: string;
    dateCin: string;
    father: string;
    mother: string;
    address: string;
    neighborHood: string;
    municipality: string;
}
interface TenantsState {
    tenants: Tenant[];
    status: "loading" | "success" | "error";
}

const initialState: TenantsState = {
    tenants: [],
    status: "loading",
};

export const fetchTenants = createAsyncThunk<Tenant[]>("/tenants/fetchTenants", async () => {
    const { data } = await axios.get("/api/tenants");
    console.log("Response:", data);
    return data;
})

export const deleteTenant = createAsyncThunk<void, number>(
    "/tenants/deleteTenant",
    async (cin) => {
        await axios.delete(`/api/tenants/${cin}`);
    }
);

const tenantsSlice = createSlice({
    name: "tenants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenants.pending, (state) => {
                state.tenants = []
                state.status = "loading"
            })
            .addCase(fetchTenants.rejected, (state) => {
                state.tenants = []
                state.status = "error"
            })
            .addCase(fetchTenants.fulfilled, (state, action) => {
                state.tenants = action.payload
                state.status = "success"
            })
            .addCase(deleteTenant.pending, (state, action) => {
                state.tenants = state.tenants.filter((tenant) => tenant.cin !== action.meta.arg)

            })
    }
});

export default tenantsSlice.reducer;