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
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer'
import { Button } from './components/Misc'
import {
	HeaderButton as RNHeaderButton,
	HeaderButtons,
	Item,
} from 'react-navigation-header-buttons'
import { Linking, View } from 'react-native'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()
const Toastbox = <Toast position="bottom" ref={(ref) => Toast.setRef(ref)} />

function StackNavFlow({ navigation }) {
	const { state } = useAuth()
	return (
		<>
			<Stack.Navigator
				screenOptions={{
					headerRight: () => (
						<HeaderButtons HeaderButtonComponent={HeaderButton}>
							<Item
								title="menu"
								iconName="bars"
								onPress={() => {
									navigation.openDrawer()
								}}
							/>
						</HeaderButtons>
					),
				}}>
				{state == 'LOGGED_OUT' ? (
					<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
				) : (
					<Stack.Screen
						name="Main"
						component={TabNavFlow}
						options={({ route }) => ({
							headerTitle: `SGuard｜${getFocusedRouteNameFromRoute(route) ?? 'Home'}`,
						})}
					/>
				)}
			</Stack.Navigator>
		</>
	)
}

//why did i even start calling them flows? it doesnt have any real meaning
function DrawerNavFlow() {
	const { state, auth } = useAuth()
	if (state == 'AUTH_LOADING')
		return (
			<View>
				<Splash />
				{Toastbox}
			</View>
		)
	return (
		<NavigationContainer>
			<Drawer.Navigator
				drawerContent={(props) => {
					return (
						<DrawerContentScrollView {...props}>
							<DrawerItem
								label="Readme"
								onPress={() => {
									Linking.openURL('https://github.com/ChatBoat/ChatBoat-SGuard_SCDFXIBM#readme')
									props.navigation.closeDrawer()
								}}
							/>
							<DrawerItem
								label="Privacy Policy"
								onPress={() => {
									Linking.openURL('https://interpause.dev/privacy')
									props.navigation.closeDrawer()
								}}
							/>
							<DrawerItem
								label="Logout"
								onPress={() => {
									auth.signOut()
									props.navigation.closeDrawer()
								}}
							/>
						</DrawerContentScrollView>
					)
				}}>
				<Drawer.Screen name="Stack" component={StackNavFlow} />
			</Drawer.Navigator>
			{Toastbox}
		</NavigationContainer>
	)
}

const HeaderButton = (props) => <RNHeaderButton IconComponent={Icon} iconSize={20} {...props} />

function getIconFunc(name) {
	return ({ color, size }) => <Icon name={name} size={size} color={color} />
}

function TabNavFlow() {
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
				{emergency ? <Alarm /> : <DrawerNavFlow />}
			</BotProvider>
		</AuthProvider>
	)
}

export default App
