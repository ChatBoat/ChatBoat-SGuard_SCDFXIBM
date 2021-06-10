import React from 'react'

import { Button, View } from 'react-native'
import { ControlPanel } from '../components/Control'
import { Card, H3 } from '../components/Misc'
import { SensorsSection } from '../components/Sensors'
import { useAuth } from '../components/AuthProvider'

function Home() {
	const { auth } = useAuth()
	return (
		<View style={{ height: '100%', backgroundColor: '#000E44' }}>
			<ControlPanel />
			<Card style={{ height: 360 }}>
				<H3>Sensors</H3>
				<SensorsSection />
			</Card>
			<Button title="logout" onPress={() => auth.signOut()} />
		</View>
	)
}

export default Home
