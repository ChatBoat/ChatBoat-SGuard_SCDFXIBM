import React from 'react'

import { View } from 'react-native'
import { ControlPanel } from '../Control'
import { Card, H3 } from '../Misc'
import { SensorsSection } from '../Sensors'

function Home() {
	return (
		<View style={{ height: '100%', backgroundColor: '#000E44' }}>
			<ControlPanel />
			<Card style={{ height: 360 }}>
				<H3>Sensors</H3>
				<SensorsSection />
			</Card>
		</View>
	)
}

export default Home
