import React, { useState } from 'react'
import { AuthProvider } from './components/AuthProvider'
import { BotProvider } from './components/BotProvider'
import Home from './pages/Home'
import Toast from 'react-native-toast-message'
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Conversation from './pages/Conversation'
import Medical from './pages/Medical'
import Splash from './pages/Splash'
import { useAuth } from './components/AuthProvider'
import Login from './pages/Login'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Alarm from './pages/Alarm'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Toastbox = <Toast position="bottom" ref={(ref) => Toast.setRef(ref)} />

function AuthNavFlow() {
	const { state } = useAuth()
	if (state == 'AUTH_LOADING')
		return (
			<>
				<Splash />
				{Toastbox}
			</>
		)
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{state == 'LOGGED_OUT' ? (
					<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
				) : (
					<Stack.Screen
						name="home"
						component={MainNavFlow}
						options={({ route }) => ({
							headerTitle: getFocusedRouteNameFromRoute(route),
						})}
					/>
				)}
			</Stack.Navigator>
			{Toastbox}
		</NavigationContainer>
	)
}

function getIconFunc(name) {
	return ({ color, size }) => <Icon name={name} size={size} color={color} />
}

function MainNavFlow() {
	return (
		<Tab.Navigator initialRouteName="Home">
			<Tab.Screen
				name="Health Info"
				component={Medical}
				options={{
					tabBarIcon: getIconFunc('notes-medical'),
				}}
			/>
			<Tab.Screen
				name="Home"
				component={Home}
				options={{
					tabBarIcon: getIconFunc('home'),
				}}
			/>
			<Tab.Screen
				name="Chat Log"
				component={Conversation}
				options={{
					tabBarIcon: getIconFunc('history'),
				}}
			/>
		</Tab.Navigator>
	)
}

function App() {
	const [emergency, setEmergency] = useState(false)
	return (
		<AuthProvider>
			<BotProvider
				emergencyCallback={(state) => {
					setEmergency(state)
				}}>
				{emergency ? <Alarm /> : <AuthNavFlow />}
			</BotProvider>
		</AuthProvider>
	)
}

export default App
