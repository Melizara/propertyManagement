import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

interface RegisterParams {
  username: string;
  email: string;
  password: string;
}
interface LoginParams {
  email: string;
  password: string;
}
interface User {
  username: string;
  email: string;
  token?: string; // Optional token field if your API returns it here
}
interface AuthState {
  data: User | null; // <-- Crucial: it can be a User object OR null
  status: 'idle' | 'loading' | 'success' | 'error';
}


export const register = createAsyncThunk("/auth/register", async (params: RegisterParams,{dispatch}) => {
  const { data } = await axios.post("api/user/register", params);

  if("token" in data){
    window.localStorage.setItem("token",data.token);
    dispatch(account());
  }
  return data;
});

export const login = createAsyncThunk("/auth/login", async (params: LoginParams , {dispatch}) => {
  const { data } = await axios.post("api/user/login", params);
  if("token" in data){
    window.localStorage.setItem("token",data.token);
    dispatch(account());
  }
  return data;
});

export const account = createAsyncThunk("/auth/account", async () => {
  const { data } = await axios.get("/api/user/account")
  return data;
})

const initialState: AuthState = { // <-- Ajout du type ici
  data: null,
  status: "idle" // Mettre 'idle' au lieu de 'loading' au démarrage est souvent plus précis
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout:(state)=>{
      state.data=null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(register.rejected, (state) => {
        state.data = null;
        state.status = "error";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(login.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(login.rejected, (state) => {
        state.data = null;
        state.status = "error";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(account.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(account.rejected, (state) => {
        state.data = null;
        state.status = "error";
      })
      .addCase(account.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })

  },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;