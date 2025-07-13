import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface User {
  id: number
  email: string
  name?: string
  full_name?: string
  role: 'admin' | 'user'
  home_directory?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null, // We don't store token in localStorage anymore
  isAuthenticated: false, // We'll check this on app load
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Login failed')
      }

      // Token is now stored in HTTP-only cookie, not localStorage
      return data
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { email: string; password: string; name?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Registration failed')
      }

      // Token is now stored in HTTP-only cookie, not localStorage
      return data
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('api/auth/profile/full', {
        credentials: 'include', // Include cookies
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch profile')
      }

      return data.user
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      })

      if (!response.ok) {
        return rejectWithValue('Logout failed')
      }

      return null
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      // Token is cleared by the server via cookie
    },
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
      // Token is stored in HTTP-only cookie by the server
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // If profile fetch fails, user might not be authenticated
        if (action.payload === 'No token provided') {
          state.isAuthenticated = false
          state.token = null
        }
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // Even if logout fails, clear the state
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { logout, clearError, setToken } = userSlice.actions
export default userSlice.reducer 