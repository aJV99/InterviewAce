import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/authSlice';
import jobReducer from '@/redux/features/jobSlice';
import storage from '@/redux/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'jobs'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;

export const persistor = persistStore(store);
