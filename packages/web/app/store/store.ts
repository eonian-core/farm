import { configureStore } from "@reduxjs/toolkit";

import localeReducer from "./slices/localeSlice";
import navigationReducer from "./slices/navigationSlice";
import vaultActionReducer from "./slices/vaultActionSlice";
import vaultUserReducer from "./slices/vaultUserSlice";

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    navigation: navigationReducer,
    vaultUser: vaultUserReducer,
    vaultAction: vaultActionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

