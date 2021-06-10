import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { View } from 'react-native'
import { useVoicebot } from '../components/BotProvider'
import Toast from 'react-native-toast-message'
import { H2 } from '../components/Misc'

function Alarm() {
	const { endCall } = useVoicebot()
	return (
		<View
			style={{
				height: '100%',
				backgroundColor: 'white',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Icon.Button
				size={128}
				iconStyle={{ marginRight: 0, padding: 0, textAlign: 'center' }}
				borderRadius={9999}
				name="bell-slash"
				backgroundColor="white"
				color="red"
				onLongPress={endCall}
			/>
			<H2>HOLD BUTTON TO DISABLE ALARM</H2>
			<Toast position="bottom" ref={(ref) => Toast.setRef(ref)} />
		</View>
	)
}

export default Alarm
