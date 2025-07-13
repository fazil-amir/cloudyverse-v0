import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/store/slices/user.slice'
import storageReducer from '@/store/slices/storage.slice'
import setupReducer from '@/store/slices/setup.slice'
import settingsReducer from '@/store/slices/settings.slice'
import fileManagerReducer from '@/store/slices/filemanager.slice';
import { errorToastMiddleware } from '@/store/middleware/error-toast.middleware'

export const store = configureStore({
  reducer: {
    user: userReducer,
    storage: storageReducer,
    setup: setupReducer,
    settings: settingsReducer,
    filemanager: fileManagerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['user/login/fulfilled', 'user/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.token'],
        // Ignore these paths in the state
        ignoredPaths: ['user.token'],
      },
    }).concat(errorToastMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 