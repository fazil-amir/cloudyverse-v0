import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface User {
  id: number
  email: string
  name?: string
  role: 'admin' | 'user'
  created_at: string
}

export interface NewUser {
  email: string
  password: string
  name?: string
}

export interface SettingsState {
  users: User[]
  isLoading: boolean
  error: string | null
  success: string | null
  isCreatingUser: boolean
  showCreateUserModal: boolean
}

// Initial state
const initialState: SettingsState = {
  users: [],
  isLoading: false,
  error: null,
  success: null,
  isCreatingUser: false,
  showCreateUserModal: false,
}

// Async thunks
export const loadUsers = createAsyncThunk(
  'settings/loadUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3006/api/platform/users', {
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to load users')
      }

      return data.users || []
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const createUser = createAsyncThunk(
  'settings/createUser',
  async (userData: NewUser, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3006/api/platform/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create user')
      }

      return data.user
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'settings/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3006/api/platform/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        return rejectWithValue(data.error || 'Failed to delete user')
      }

      return userId
    } catch (error) {
      return rejectWithValue('Network error occurred')
    }
  }
)

export const testStorageConnection = createAsyncThunk(
  'settings/testConnection',
  async (backendType: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3006/api/storage/backends/${backendType}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Connection test failed')
      }

      return { backendType, success: data.success }
    } catch (error) {
      return rejectWithValue({ backendType, error: 'Network error occurred' })
    }
  }
)

// Slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = null
    },
    setShowCreateUserModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateUserModal = action.payload
    },
    setTestResult: (state, action: PayloadAction<{ backendType: string; result: 'success' | 'error' | null }>) => {
      // This would be used to track test results per backend
      // Implementation depends on how you want to store test results
    },
  },
  extraReducers: (builder) => {
    // Load Users
    builder
      .addCase(loadUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
        state.error = null
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create User
    builder
      .addCase(createUser.pending, (state) => {
        state.isCreatingUser = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreatingUser = false
        state.users.push(action.payload)
        state.success = 'User created successfully'
        state.showCreateUserModal = false
        state.error = null
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreatingUser = false
        state.error = action.payload as string
      })

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = state.users.filter(user => user.id !== action.payload)
        state.success = 'User deleted successfully'
        state.error = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Test Storage Connection
    builder
      .addCase(testStorageConnection.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(testStorageConnection.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = `Connection test successful for ${action.payload.backendType}`
        state.error = null
      })
      .addCase(testStorageConnection.rejected, (state, action) => {
        state.isLoading = false
        const payload = action.payload as { backendType: string; error: string }
        state.error = `Connection test failed for ${payload.backendType}: ${payload.error}`
      })
  },
})

export const { clearError, clearSuccess, setShowCreateUserModal, setTestResult } = settingsSlice.actions

export default settingsSlice.reducer 