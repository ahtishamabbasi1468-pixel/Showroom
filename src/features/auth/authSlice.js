import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  friendlyAuthError,
  fetchUserProfile,
} from "../../firebase/authService";

const storedUser = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
  user: storedUser, // { uid, name, email, phone, role, status }
  isAuthenticated: !!storedUser,
  status: "idle", // idle | loading | succeeded | failed
  authReady: false, // becomes true once Firebase's own auth listener has fired once
  error: null,
};

export const register = createAsyncThunk("auth/register", async (form, { rejectWithValue }) => {
  try {
    return await registerUser(form);
  } catch (err) {
    return rejectWithValue(friendlyAuthError(err));
  }
});

export const login = createAsyncThunk("auth/login", async (form, { rejectWithValue }) => {
  try {
    return await loginUser(form);
  } catch (err) {
    return rejectWithValue(friendlyAuthError(err));
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

export const sendPasswordReset = createAsyncThunk(
  "auth/sendPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      await requestPasswordReset(email);
      return email;
    } catch (err) {
      return rejectWithValue(friendlyAuthError(err));
    }
  }
);

/** Called by the Firebase onAuthStateChanged listener set up in App.jsx. */
export const syncAuthFromFirebase = createAsyncThunk(
  "auth/syncAuthFromFirebase",
  async (firebaseUser) => {
    if (!firebaseUser) return null;
    const profile = await fetchUserProfile(firebaseUser.uid);
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: profile?.name || firebaseUser.displayName || firebaseUser.email.split("@")[0],
      phone: profile?.phone || "",
      role: profile?.role || "Customer",
      status: profile?.status || "Active",
    };
  }
);

const persistUser = (user) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        persistUser(action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      })
      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        persistUser(action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        persistUser(null);
      })
      // password reset
      .addCase(sendPasswordReset.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendPasswordReset.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Could not send reset email";
      })
      // firebase auth-state sync (page refresh, etc.)
      .addCase(syncAuthFromFirebase.fulfilled, (state, action) => {
        state.authReady = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
          persistUser(action.payload);
        } else {
          state.user = null;
          state.isAuthenticated = false;
          persistUser(null);
        }
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
