import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './RootReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
const persistor = persistStore(store);
export {store, persistor};