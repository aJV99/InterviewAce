import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/authSlice';
import jobReducer from '@/redux/features/jobSlice';
import storage from '@/redux/storage';

// import interviewReducer from './features/interviewSlice';
// import questionReducer from './features/questionSlice';

const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['auth', 'jobs', 'interviews', 'questions'], // only auth will be persisted, add other reducer names if needed
  whitelist: ['auth', 'jobs'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  // interviews: interviewReducer,
  // questions: questionReducer,
  // ... add other slices here
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

// If you're using PersistGate:
export const persistor = persistStore(store);
