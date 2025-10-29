import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";
import { AxiosError } from "axios";

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
  data: User | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null; // ✅ ajouté
}

const initialState: AuthState = {
  data: null,
  status: "idle",
  error: null, // ✅ ajouté
};

export const register = createAsyncThunk("/auth/register", async (params: RegisterParams, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.post("api/user/register", params);

    if ("token" in data) {
      window.localStorage.setItem("token", data.token);
      dispatch(account());
    }
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response?.status === 400) {
      if (error.response.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue("Oops")
  }
});
export const login = createAsyncThunk("/auth/login", async (params: LoginParams, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.post("api/user/login", params);
    if ("token" in data) {
      window.localStorage.setItem("token", data.token);
      dispatch(account());
    }
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response?.status === 400 || error.response?.status === 404) {
      if (error.response.data?.message) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue("Oops")
  }
});
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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