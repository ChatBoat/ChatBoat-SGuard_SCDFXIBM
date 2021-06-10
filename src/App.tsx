import React from 'react'
import { View } from 'react-native'
import { BotProvider } from './BotProvider'
import Home from './pages/Home'
import Toast from 'react-native-toast-message'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, Header } from '@react-navigation/stack'
import Conversation from './pages/Conversation'
import Medical from './pages/Medical'

const Stack = createStackNavigator()

function App() {
	return (
		<BotProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="home">
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
