import React from 'react'

import { View } from 'react-native'
import { ControlPanel } from '../components/Control'
import { Card, H3 } from '../components/Misc'
import { SensorsSection } from '../components/Sensors'

function Medical() {
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

export default Medical
