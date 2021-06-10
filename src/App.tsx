import React, { useEffect, useState } from 'react'
import { BotProvider } from './components/BotProvider'
import Home from './pages/Home'
import Toast from 'react-native-toast-message'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, Header } from '@react-navigation/stack'
import Conversation from './pages/Conversation'
import Medical from './pages/Medical'
import Splash from './pages/Splash'

const Stack = createStackNavigator()

function App() {
	return (
		<BotProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="splash">
					<Stack.Screen name="splash" component={Splash} options={{ headerShown: false }} />
					<Stack.Screen name="home" component={Home} />
					<Stack.Screen name="conversation" component={Conversation} />
					<Stack.Screen name="medical" component={Medical} />
				</Stack.Navigator>
				<Toast ref={(ref) => Toast.setRef(ref)} />
			</NavigationContainer>
		</BotProvider>
	)
}

export default App
