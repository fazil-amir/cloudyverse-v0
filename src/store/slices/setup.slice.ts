import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface SetupData {
  adminEmail: string
  password: string
  adminName: string
  homeDirectory: string
}

export interface SetupState {
  isLoading: boolean
  error: string | null
  isSetupComplete: boolean | null
  setupData: SetupData | null
}

// Initial state
const initialState: SetupState = {
  isLoading: false,
  error: null,
  isSetupComplete: null,
  setupData: null,
}

// Async thunks
export const performSetup = createAsyncThunk(
  'setup/perform',
  async (setupData: SetupData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3006/api/platform/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(setupData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Setup failed')
      }

      return data
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const checkSetupStatus = createAsyncThunk(
  'setup/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3006/api/platform/setup-status', {
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to check setup status')
      }

      return data.setupComplete
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

// Slice
const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSetupData: (state, action: PayloadAction<Partial<SetupData>>) => {
      state.setupData = { ...state.setupData, ...action.payload } as SetupData
    },
    resetSetup: (state) => {
      state.setupData = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Perform Setup
    builder
      .addCase(performSetup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(performSetup.fulfilled, (state) => {
        state.isLoading = false
        state.isSetupComplete = true
        state.error = null
      })
      .addCase(performSetup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Check Setup Status
    builder
      .addCase(checkSetupStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(checkSetupStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSetupComplete = action.payload
        state.error = null
      })
      .addCase(checkSetupStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setSetupData, resetSetup } = setupSlice.actions

export default setupSlice.reducer 