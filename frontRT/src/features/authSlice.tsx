import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { AxiosError } from "axios";

//Ces codes suivant sont des interfaces avec ts
//Ca sert a connnaitre le type de chaque données pour eviter les erreurs
interface RegisterParams {
  matricule: string;
  pseudo: string;
  poste: string;
  email: string;
  password: string;
}
interface LoginParams {
  matricule: string;
  password: string;
}
interface User {
  matricule: string;
  pseudo: string;
  email: string;
  token?: string; // Optional token field if your API returns it here
  poste: "admin" | "caissier" | "operateur de saisie"; // 👈 ajoute ceci
}
interface AuthError {
  field: "matricule" | "password";
  message: string;
}

interface AuthState {
  data: User | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: AuthError | null; // au lieu de string
}


//Ceci est l'etat initale qui herite du interface AuthState.
const initialState: AuthState = {
  data: null,
  status: "idle",
  error: null, // ✅ ajouté
};

//Ceci est une fonction asynchrone qui sert a appeller l'API
//Regitser zao ity
export const register = createAsyncThunk("/auth/register", async (params: RegisterParams, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.post("api/user/register", params);

    if ("token" in data) {
      window.localStorage.setItem("token", data.token);
      dispatch(account());
    }
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string; field?: "matricule" | "password" }>;
    if (error.response?.status === 400 || error.response?.status === 404) {
      if (error.response.data?.message) {
        return rejectWithValue({
          field: error.response.data.field || "matricule",
          message: error.response.data.message
        });
      }
      return rejectWithValue({
        field: "matricule",
        message: "Erreur inconnue"
      });
    }
    return rejectWithValue({
      field: "matricule",
      message: "Oops"
    });
  }
});
//Login
export const login = createAsyncThunk("/auth/login", async (params: LoginParams, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.post("api/user/login", params);
    if (data && typeof data === "object" && "token" in data) {
      window.localStorage.setItem("token", data.token);
      dispatch(account());
    }
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string; field?: "matricule" | "password" }>;
    if (error.response?.status === 400 || error.response?.status === 404) {
      if (error.response.data?.message) {
        return rejectWithValue({
          field: error.response.data.field || "matricule",
          message: error.response.data.message
        });
      }
      return rejectWithValue({
        field: "matricule",
        message: "Erreur inconnue"
      });
    }
    return rejectWithValue({
      field: "matricule",
      message: "Oops"
    });
  }
});

//Recuperation de l'infos du compte
export const account = createAsyncThunk("/auth/account", async () => {
  const { data } = await axios.get("/api/user/account")
  return data;
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.data = null;
        state.status = "loading";
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as AuthError;
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
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as AuthError;
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

export const { logout } = authSlice.actions;
export const { clearError } = authSlice.actions;
export default authSlice.reducer;