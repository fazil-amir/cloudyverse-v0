import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/store/slices/user.slice'
import storageReducer from '@/store/slices/storage.slice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    storage: storageReducer,
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
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 