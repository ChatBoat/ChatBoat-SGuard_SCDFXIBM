import React, { useLayoutEffect, createContext, useContext, ReactNode } from 'react'
import RNCallKeep from 'react-native-callkeep'
import { emergencyEventEmitter, FALL_DETECTED } from '../FallDetection'
import { RNTwilioPhone } from './RNTwilioPhone'

const identity = 'TestUser'

const callkeepConfig = {
	ios: {
		appName: 'SGuard',
		supportsVideo: false,
	},
	android: {
		alertTitle: 'Permissions required',
		alertDescription: 'This application needs to access your phone accounts',
		cancelButton: 'Cancel',
		okButton: 'ok',
		imageName: 'phone_account_icon',
		additionalPermissions: [''],
		// Required to get audio in background when using Android 11
		foregroundService: {
			channelId: 'com.sguard.callkeep',
			channelName: 'SGuard Callkeep Microphone Service',
			notificationTitle: 'In-app voicebot is using your microphone',
			notificationIcon: 'phone_account_icon',
		},
	},
}

async function fetchAccessToken() {
	const response = await fetch(
		`https://quickstart-8910-dev.twil.io/access-token?identity=${identity}`
	)
	const accessToken = await response.text()
	console.debug(`Access token received: ${accessToken}`)
	return accessToken
}

export const BotContext = createContext({
	startCall: () => {},
	endCall: () => {},
})
export const useVoicebot = () => useContext(BotContext)

export interface BotProviderProps {
	children: ReactNode
	emergencyCallback: (b: boolean) => void
}
export function BotProvider({ children, emergencyCallback }: BotProviderProps) {
	const startCall = () => {
		RNTwilioPhone.startCall(
			'sips:+19285971659@public.voip.jp-tok.assistant.watson.cloud.ibm.com',
			'SGuardianBot',
			identity,
			{
				secret: 'hello world',
			}
		)
		emergencyCallback(true)
	}
	const endCall = () => {
		RNTwilioPhone.endAllCalls()
		RNCallKeep.endAllCalls()
		emergencyCallback(false)
	}
	useLayoutEffect(() => {
		//RNTwilioPhone is a wrapper over TwilioPhone that implements the basic features
		//We are gonna ignore it and use TwilioPhone directly so I can hack stuff
		RNTwilioPhone.handleBackgroundState()
		RNTwilioPhone.initialize(callkeepConfig, fetchAccessToken)
		//dont deregister the handlers when app shuts down
	}, [])
	useLayoutEffect(() => {
		emergencyEventEmitter.removeAllListeners(FALL_DETECTED)
		emergencyEventEmitter.addListener(FALL_DETECTED, () => {
			startCall()
		})
		if (RNTwilioPhone.calls.length > 0) emergencyCallback(true)
	}, [])
	return <BotContext.Provider value={{ startCall, endCall }}>{children}</BotContext.Provider>
}
