import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StorageConfig {
  backend: 'LOCAL' | 'S3' | 'R2'
  name: string
  enabled: boolean
  config?: Record<string, any>
}

export interface StorageState {
  currentBackend: 'LOCAL' | 'S3' | 'R2'
  backends: StorageConfig[]
  isLoading: boolean
  error: string | null
}

const initialState: StorageState = {
  currentBackend: 'LOCAL',
  backends: [
    {
      backend: 'LOCAL',
      name: 'Local File System',
      enabled: true,
      config: {}
    },
    {
      backend: 'S3',
      name: 'AWS S3',
      enabled: false,
      config: {
        bucket: '',
        region: '',
        accessKeyId: '',
        secretAccessKey: ''
      }
    },
    {
      backend: 'R2',
      name: 'Cloudflare R2',
      enabled: false,
      config: {
        bucket: '',
        accountId: '',
        accessKeyId: '',
        secretAccessKey: ''
      }
    }
  ],
  isLoading: false,
  error: null
}

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    setCurrentBackend: (state, action: PayloadAction<'LOCAL' | 'S3' | 'R2'>) => {
      state.currentBackend = action.payload
      localStorage.setItem('storageBackend', action.payload)
    },
    updateBackendConfig: (state, action: PayloadAction<{ backend: 'LOCAL' | 'S3' | 'R2', config: Record<string, any> }>) => {
      const { backend, config } = action.payload
      const backendConfig = state.backends.find(b => b.backend === backend)
      if (backendConfig) {
        backendConfig.config = { ...backendConfig.config, ...config }
      }
    },
    toggleBackend: (state, action: PayloadAction<'LOCAL' | 'S3' | 'R2'>) => {
      const backend = state.backends.find(b => b.backend === action.payload)
      if (backend) {
        backend.enabled = !backend.enabled
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const { 
  setCurrentBackend, 
  updateBackendConfig, 
  toggleBackend, 
  setLoading, 
  setError, 
  clearError 
} = storageSlice.actions

export default storageSlice.reducer 