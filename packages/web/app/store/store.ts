import { configureStore } from "@reduxjs/toolkit";

import localeReducer from "./slices/localeSlice";
import navigationReducer from "./slices/navigationSlice";
import vaultActionReducer, { failVaultAction } from "./slices/vaultActionSlice";
import vaultUserReducer from "./slices/vaultUserSlice";

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    navigation: navigationReducer,
    vaultUser: vaultUserReducer,
    vaultAction: vaultActionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [failVaultAction.type],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
