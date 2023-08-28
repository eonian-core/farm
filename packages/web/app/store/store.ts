import { configureStore, isPlain } from '@reduxjs/toolkit'

import localeReducer from './slices/localeSlice'
import navigationReducer from './slices/navigationSlice'
import positionInfoSlice from './slices/positionInfoSlice'
import vaultActionReducer from './slices/vaultActionSlice'
import vaultUserReducer from './slices/vaultUserSlice'

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    navigation: navigationReducer,
    vaultUser: vaultUserReducer,
    vaultAction: vaultActionReducer,
    positionInfo: positionInfoSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: (value: any) => isPlain(value) || typeof value === 'bigint',
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
