import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LocaleState {
  current: string
}

const initialState: LocaleState = {
  current: 'en',
}

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<string>) => {
      state.current = action.payload
    },
  },
})

export const { setLocale } = localeSlice.actions
export default localeSlice.reducer
