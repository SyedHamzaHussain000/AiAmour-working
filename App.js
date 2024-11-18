import React from 'react';
import Navigation from './src/navigation';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text, SafeAreaView } from 'react-native';

const App = () => {
  return (
        <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  )
}

export default App