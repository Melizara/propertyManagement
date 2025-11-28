// Import de Redux Toolkit pour créer le slice et les actions asynchrones
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Import d'axios pour faire les requêtes HTTP
import axios from "../axios";
// Type pour gérer les erreurs Axios
import { AxiosError } from "axios";

// Interfaces TypeScript pour typer les données
// Sert à savoir quels types de données on attend pour éviter les erreurs
interface RegisterParams {
  matricule: string; // matricule de l'utilisateur
  pseudo: string; // pseudo
  poste: string; // rôle de l'utilisateur
  email: string; // email
  password: string; // mot de passe
}

interface LoginParams {
  matricule: string; // matricule pour login
  password: string; // mot de passe
}

interface User {
  matricule: string;
  pseudo: string;
  email: string;
  token?: string; // token optionnel (retourné par l'API après login)
  poste: "admin" | "caissier" | "operateur de saisie"; // rôle de l'utilisateur
}

interface AuthError {
  [key: string]: string; // clé = nom du champ, valeur = message
}

interface AuthState {
  data: User | null; // info utilisateur
  status: 'idle' | 'loading' | 'success' | 'error'; // état de la requête
  error: AuthError | null; // erreur éventuelle
}

// État initial du slice
const initialState: AuthState = {
  data: null, // pas d'utilisateur connecté au départ
  status: "idle", // état initial
  error: null, // pas d'erreur
};

// Action asynchrone pour l'inscription (register)
export const register = createAsyncThunk(
  "/auth/register",
  async (params: RegisterParams, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("api/user/register", params);

      if ("token" in data) {
        window.localStorage.setItem("token", data.token);
        dispatch(account());
      }

      return data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const fieldErrors: AuthError = {};

      if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (message.includes("Email")) {
          fieldErrors.email = message;
        } else if (message.includes("Matricule")) {
          fieldErrors.matricule = message;
        } else {
          fieldErrors.general = message;
        }

        return rejectWithValue(fieldErrors);
      }
      return rejectWithValue({ general: error.message || "Erreur inconnue" });
    }
  }
);


// Action asynchrone pour le login
export const login = createAsyncThunk(
  "/auth/login",
  async (params: LoginParams, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.post("api/user/login", params);
      if (data && typeof data === "object" && "token" in data) {
        window.localStorage.setItem("token", data.token);
        dispatch(account()); // récupère les infos du compte
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
  }
);

// Action asynchrone pour récupérer les infos du compte connecté
export const account = createAsyncThunk("/auth/account", async () => {
  const { data } = await axios.get("/api/user/account"); // requête GET vers /account
  return data;
});

// Création du slice Redux
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null; // supprime les infos de l'utilisateur
    },
    clearError(state) {
      state.error = null; // supprime les erreurs
    }
  },
  extraReducers: (builder) => {
    // Gestion des différentes étapes des actions asynchrones
    builder
      .addCase(register.pending, (state) => {
        state.data = null;
        state.status = "loading"; // en cours
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as AuthError; // stocke l'erreur
        state.status = "error";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.data = action.payload; // stocke l'utilisateur
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
      });
  },
});

// Export des actions pour pouvoir les utiliser dans les composants
export const { logout } = authSlice.actions;
export const { clearError } = authSlice.actions;
// Export du reducer pour l'ajouter au store Redux
export default authSlice.reducer;
