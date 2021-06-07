import React from 'react';
import { View } from 'react-native';
import { BotProvider } from './BotProvider';
import Home from './pages/Home';

function App() {
  return (
    <View>
      <BotProvider>
        <Home/>
      </BotProvider>
    </View>
  );
}

export default App;
