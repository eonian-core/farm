import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NavigationSlice {
  pageLoading: string | null
}

const initialState: NavigationSlice = {
  pageLoading: null,
}

const navigationSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<string | null>) => {
      state.pageLoading = action.payload
    },
  },
})

export const { setPageLoading } = navigationSlice.actions
export default navigationSlice.reducer
