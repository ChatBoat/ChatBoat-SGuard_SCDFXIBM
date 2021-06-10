import React, { useEffect, useState } from 'react'
import { css } from '@emotion/native'
import {
	emergencyEventEmitter,
	FALL_DETECTION_STARTED,
	FALL_DETECTION_STOPPED,
	isServiceRunning,
	startFallDetectionService,
	stopFallDetectionService,
} from '../FallDetection'

import { View, Switch } from 'react-native'
import { Button, Card, H3, H4, Row } from './Misc'
import Toast from 'react-native-toast-message'
import { useVoicebot } from './BotProvider'

function FallDetectionControl() {
	const [isRunning, setRunning] = useState(false)
	useEffect(() => {
		isServiceRunning().then(setRunning)
	}, [])
	useEffect(() => {
		if (isRunning) {
			startFallDetectionService(1000)
			setTimeout(() => {
				isServiceRunning().then((running) => {
					if (running) return
					Toast.show({ type: 'error', text1: 'Service failed to start', position: 'bottom' })
					setRunning(false)
				})
			}, 1000)
		} else {
			stopFallDetectionService()
		}
		emergencyEventEmitter.addListener(FALL_DETECTION_STARTED, () => {
			Toast.show({ type: 'info', text1: 'Service started', position: 'bottom' })
			setRunning(true)
		})
		emergencyEventEmitter.addListener(FALL_DETECTION_STOPPED, () => {
			Toast.show({ type: 'info', text1: 'Service stopped', position: 'bottom' })
			setRunning(false)
		})
	}, [isRunning])

	return (
		<Row
			style={css`
				justify-content: space-between;
				align-items: baseline;
			`}>
			<H4
				style={css`
					flex-shrink: 0;
				`}>
				Fall Detection Service:{' '}
			</H4>
			<View
				style={css`
					flex-grow: 1;
				`}
			/>
			<H4
				style={css`
					flex-shrink: 0;
					margin-right: 4px;
					color: ${isRunning ? 'green' : 'red'};
				`}>
				{isRunning ? 'RUNNING' : 'STOPPED'}
			</H4>
			<Switch
				style={css`
					top: 3px;
				`}
				trackColor={{ false: '#767577', true: '#81b0ff' }}
				thumbColor={isRunning ? '#f5dd4b' : '#f4f3f4'}
				ios_backgroundColor="#3e3e3e"
				onValueChange={setRunning}
				value={isRunning}
			/>
		</Row>
	)
}

function CallControl() {
	const { startCall, endCall } = useVoicebot()

	return (
		<Row
			style={css`
				justify-content: space-around;
			`}>
			<Button
				style={css`
					flex: 1;
					margin: 0px 8px;
				`}
				onPress={startCall}>
				Start Call
			</Button>
			<Button
				style={css`
					flex: 1;
					margin: 0px 8px;
				`}
				onPress={endCall}>
				End Call
			</Button>
		</Row>
	)
}

export function ControlPanel() {
	return (
		<Card
			style={css`
				height: 180px;
			`}>
			<H3>Control Panel</H3>
			<FallDetectionControl />
			<CallControl />
		</Card>
	)
}
