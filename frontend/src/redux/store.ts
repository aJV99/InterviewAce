import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import jobReducer from "./features/jobSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will be persisted, add other reducer names if needed
};

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  // ... add other slices here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;

// If you're using PersistGate:
export const persistor = persistStore(store);
