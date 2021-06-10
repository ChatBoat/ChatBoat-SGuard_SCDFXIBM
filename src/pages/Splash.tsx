import React from 'react'

import { ActivityIndicator, Image, View } from 'react-native'

function Splash() {
	return (
		<View
			style={{
				height: '100%',
				backgroundColor: 'white',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Image style={{ width: 240, height: 240 }} source={require('../img/SGuard.png')} />
			<ActivityIndicator style={{ margin: 16 }} size="large" color="#00aaff" />
		</View>
	)
}

export default Splash
