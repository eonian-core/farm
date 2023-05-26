import { configureStore } from "@reduxjs/toolkit";

import localeReducer from "./slices/localeSlice";
import navigationReducer from "./slices/navigationSlice";

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

