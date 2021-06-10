import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'
import RNCallKeep, { IOptions } from 'react-native-callkeep'
import {
	ConnectParams,
	EventType,
	TwilioPhone,
	twilioPhoneEmitter,
} from 'react-native-twilio-phone'
import VoipPushNotification from 'react-native-voip-push-notification'
import ramdomUuid from 'uuid-random'

export type RNTwilioPhoneOptions = {
	requestPermissionsOnInit: boolean // Default: true
}

type Call = {
	uuid: string | null
	sid: string | null
}

const defaultOptions: RNTwilioPhoneOptions = {
	requestPermissionsOnInit: true,
}

const CK_CONSTANTS = {
	END_CALL_REASONS: {
		FAILED: 1,
		REMOTE_ENDED: 2,
		UNANSWERED: 3,
		ANSWERED_ELSEWHERE: 4,
		DECLINED_ELSEWHERE: 5,
		MISSED: 6,
	},
}

class RNTwilioPhone {
	static calls: Call[] = []

	private static fetchAccessToken: () => Promise<string>
	private static deviceToken: string | null = null
	private static activeCall: Call | null = null

	static initialize(
		callKeepOptions: IOptions,
		fetchAccessToken: () => Promise<string>,
		options = defaultOptions
	) {
		const unsubscribeCallKeep = RNTwilioPhone.initializeCallKeep(
			callKeepOptions,
			fetchAccessToken,
			options
		)

		const unsubscribeRegisterAndroid = RNTwilioPhone.registerAndroid()
		const unsubscribeRegisterIOS = RNTwilioPhone.registerIOS()

		console.debug('RNTwilioPhone initialized')
		return () => {
			unsubscribeCallKeep()
			unsubscribeRegisterAndroid()
			unsubscribeRegisterIOS()
			console.debug('RNTwilioPhone cleaned up')
		}
	}

	static initializeCallKeep(
		callKeepOptions: IOptions,
		fetchAccessToken: () => Promise<string>,
		options = defaultOptions
	) {
		const { requestPermissionsOnInit } = options

		RNTwilioPhone.fetchAccessToken = fetchAccessToken

		if (Platform.OS === 'ios' || requestPermissionsOnInit) {
			RNCallKeep.setup(callKeepOptions)
				.then(() => {
					RNCallKeep.setAvailable(true)
				})
				.catch((e) => console.error(e))
		} else {
			RNCallKeep.registerPhoneAccount()
			RNCallKeep.registerAndroidEvents()
			RNCallKeep.setAvailable(true)
		}

		const unsubscribeTwilioPhone = RNTwilioPhone.listenTwilioPhone()
		const unsubscribeCallKeep = RNTwilioPhone.listenCallKeep()

		console.debug('CallKeep initialized')
		return () => {
			unsubscribeTwilioPhone()
			unsubscribeCallKeep()
			console.debug('CallKeep cleaned up')
		}
	}

	static handleBackgroundState() {
		if (Platform.OS !== 'android') {
			return
		}

		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			if (!remoteMessage.data) {
				return
			}

			RNCallKeep.registerPhoneAccount()
			RNCallKeep.registerAndroidEvents()
			RNCallKeep.setAvailable(true)

			RNTwilioPhone.listenTwilioPhone()
			RNTwilioPhone.listenCallKeep()

			TwilioPhone.handleMessage(remoteMessage.data)
		})
	}

	static async startCall(to: string, calleeName?: string, from?: string, addParams?: {}) {
		const accessToken = await RNTwilioPhone.fetchAccessToken()
		const params: ConnectParams = { ...addParams, to }
		if (from) params.from = from

		TwilioPhone.startCall(accessToken, params)

		const uuid = ramdomUuid().toLowerCase()
		RNTwilioPhone.activeCall = { uuid: uuid, sid: null }

		RNCallKeep.startCall(uuid, calleeName, calleeName, 'generic')
		RNCallKeep.toggleAudioRouteSpeaker(uuid, true)
	}

	static async unregister() {
		if (!RNTwilioPhone.deviceToken) {
			return
		}

		const accessToken = await RNTwilioPhone.fetchAccessToken()
		TwilioPhone.unregister(accessToken, RNTwilioPhone.deviceToken)
	}

	private static registerAndroid() {
		if (Platform.OS !== 'android') {
			return () => {}
		}

		messaging()
			.getToken()
			.then(RNTwilioPhone.registerTwilioPhone)
			.catch((e) => console.error(e))

		// Listen to whether the token changes
		const unsubscribeTokenRefresh = messaging().onTokenRefresh(RNTwilioPhone.registerTwilioPhone)

		const unsubscribeMessage = messaging().onMessage((remoteMessage) => {
			if (remoteMessage.data) {
				TwilioPhone.handleMessage(remoteMessage.data)
			}
		})

		return () => {
			unsubscribeTokenRefresh()
			unsubscribeMessage()
		}
	}

	private static registerIOS() {
		if (Platform.OS !== 'ios') {
			return () => {}
		}

		VoipPushNotification.addEventListener('register', RNTwilioPhone.registerTwilioPhone)

		VoipPushNotification.addEventListener('notification', (notification: any) => {
			delete notification.aps
			TwilioPhone.handleMessage(notification)
		})

		VoipPushNotification.registerVoipToken()

		return () => {
			VoipPushNotification.removeEventListener('register')
			VoipPushNotification.removeEventListener('notification')
		}
	}

	private static listenTwilioPhone() {
		RNTwilioPhone.removeTwilioPhoneListeners()

		const subscriptions = [
			twilioPhoneEmitter.addListener(EventType.CallInvite, ({ callSid, from }) => {
				// Incoming call is already reported to CallKit on iOS
				if (Platform.OS === 'android') {
					const uuid = ramdomUuid().toLowerCase()
					RNTwilioPhone.addCall({ uuid, sid: callSid })

					RNCallKeep.displayIncomingCall(uuid, from)
				}
			}),
			twilioPhoneEmitter.addListener(EventType.CancelledCallInvite, ({ callSid }) => {
				const uuid = RNTwilioPhone.getCallUUID(callSid)

				if (uuid) {
					RNCallKeep.reportEndCallWithUUID(uuid, CK_CONSTANTS.END_CALL_REASONS.MISSED)

					RNTwilioPhone.removeCall(uuid)
				}
			}),
			twilioPhoneEmitter.addListener(EventType.CallRinging, ({ callSid }) => {
				if (RNTwilioPhone.activeCall) {
					RNTwilioPhone.activeCall.sid = callSid

					if (RNTwilioPhone.activeCall.uuid) {
						RNTwilioPhone.addCall(RNTwilioPhone.activeCall)
						RNTwilioPhone.activeCall = null
					}
				}
			}),
			twilioPhoneEmitter.addListener(EventType.CallConnected, ({ callSid }) => {
				const uuid = RNTwilioPhone.getCallUUID(callSid)

				uuid && RNCallKeep.setCurrentCallActive(uuid)
				RNCallKeep.backToForeground()
			}),
			twilioPhoneEmitter.addListener(EventType.CallDisconnected, ({ callSid }) => {
				const uuid = RNTwilioPhone.getCallUUID(callSid)

				if (uuid) {
					RNCallKeep.reportEndCallWithUUID(uuid, CK_CONSTANTS.END_CALL_REASONS.REMOTE_ENDED)

					RNTwilioPhone.removeCall(uuid)
				}
				RNCallKeep.backToForeground()
			}),
			twilioPhoneEmitter.addListener(EventType.CallDisconnectedError, ({ callSid }) => {
				const uuid = RNTwilioPhone.getCallUUID(callSid)

				if (uuid) {
					RNCallKeep.reportEndCallWithUUID(uuid, CK_CONSTANTS.END_CALL_REASONS.FAILED)

					RNTwilioPhone.removeCall(uuid)
				}
			}),
		]

		console.debug('TwilioPhone event listeners added')
		return () => {
			subscriptions.map((subscription) => {
				subscription.remove()
			})
			console.debug('TwilioPhone event listeners removed')
		}
	}

	private static listenCallKeep() {
		RNTwilioPhone.removeCallKeepListeners()

		if (Platform.OS === 'ios') {
			RNCallKeep.addEventListener('didDisplayIncomingCall', ({ callUUID, payload }) => {
				RNTwilioPhone.addCall({ uuid: callUUID, sid: payload.twi_call_sid })
			})

			RNCallKeep.addEventListener('didResetProvider', () => {
				TwilioPhone.deactivateAudio()
			})

			RNCallKeep.addEventListener('didActivateAudioSession', () => {
				TwilioPhone.activateAudio()
			})

			RNCallKeep.addEventListener('didDeactivateAudioSession', () => {
				TwilioPhone.deactivateAudio()
			})
		}

		RNCallKeep.addEventListener('didReceiveStartCallAction', ({ callUUID }) => {
			if (RNTwilioPhone.activeCall) {
				RNTwilioPhone.activeCall.uuid = callUUID

				if (RNTwilioPhone.activeCall.sid) {
					RNTwilioPhone.addCall(RNTwilioPhone.activeCall)
					RNTwilioPhone.activeCall = null
				}
			}
		})

		RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
			const sid = RNTwilioPhone.getCallSid(callUUID)
			sid && TwilioPhone.acceptCallInvite(sid)
		})

		RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
			RNTwilioPhone.endCall(callUUID)
		})

		RNCallKeep.addEventListener('didPerformSetMutedCallAction', ({ callUUID, muted }) => {
			const sid = RNTwilioPhone.getCallSid(callUUID)

			sid && TwilioPhone.toggleMuteCall(sid, muted)
		})

		RNCallKeep.addEventListener('didToggleHoldCallAction', ({ callUUID, hold }) => {
			const sid = RNTwilioPhone.getCallSid(callUUID)

			sid && TwilioPhone.toggleHoldCall(sid, hold)
		})

		RNCallKeep.addEventListener('didPerformDTMFAction', ({ callUUID, digits }) => {
			const sid = RNTwilioPhone.getCallSid(callUUID)

			sid && TwilioPhone.sendDigits(sid, digits)
		})

		console.debug('CallKeep event listeners added')
		return () => {
			RNTwilioPhone.removeCallKeepListeners()
			console.debug('CallKeep event listeners removed')
		}
	}

	static endCall(callUUID: string) {
		const sid = RNTwilioPhone.getCallSid(callUUID)

		sid && TwilioPhone.endCall(sid)

		RNTwilioPhone.removeCall(callUUID)
	}

	static endAllCalls() {
		;[...RNTwilioPhone.calls].forEach((call) => {
			RNTwilioPhone.endCall(call.uuid)
		})
	}

	private static removeTwilioPhoneListeners() {
		twilioPhoneEmitter.removeAllListeners(EventType.CallInvite)
		twilioPhoneEmitter.removeAllListeners(EventType.CancelledCallInvite)
		twilioPhoneEmitter.removeAllListeners(EventType.CallRinging)
		twilioPhoneEmitter.removeAllListeners(EventType.CallConnected)
		twilioPhoneEmitter.removeAllListeners(EventType.CallDisconnected)
		twilioPhoneEmitter.removeAllListeners(EventType.CallDisconnectedError)
	}

	private static removeCallKeepListeners() {
		if (Platform.OS === 'ios') {
			RNCallKeep.removeEventListener('didDisplayIncomingCall')
			RNCallKeep.removeEventListener('didResetProvider')
			RNCallKeep.removeEventListener('didActivateAudioSession')
			RNCallKeep.removeEventListener('didDeactivateAudioSession')
		}

		RNCallKeep.removeEventListener('didReceiveStartCallAction')
		RNCallKeep.removeEventListener('answerCall')
		RNCallKeep.removeEventListener('endCall')
		RNCallKeep.removeEventListener('didPerformSetMutedCallAction')
		RNCallKeep.removeEventListener('didToggleHoldCallAction')
		RNCallKeep.removeEventListener('didPerformDTMFAction')
	}

	private static async registerTwilioPhone(deviceToken: string) {
		try {
			const accessToken = await RNTwilioPhone.fetchAccessToken()

			TwilioPhone.register(accessToken, deviceToken)
			RNTwilioPhone.deviceToken = deviceToken
		} catch (e) {
			console.error(e)
		}
	}

	private static addCall(call: Call) {
		console.debug('Call added: ', call)
		RNTwilioPhone.calls.push(call)
	}

	private static removeCall(uuid: string) {
		let index = -1

		for (let i = 0; i < RNTwilioPhone.calls.length; i++) {
			if (RNTwilioPhone.calls[i].uuid === uuid) {
				index = i
				break
			}
		}

		if (index > -1) {
			console.debug('Call removed: ', RNTwilioPhone.calls.splice(index, 1)[0])
		}
	}

	private static getCallUUID(sid: string) {
		for (const call of RNTwilioPhone.calls) {
			if (call.sid === sid) {
				return call.uuid
			}
		}

		return null
	}

	private static getCallSid(uuid: string) {
		for (const call of RNTwilioPhone.calls) {
			if (call.uuid === uuid) {
				return call.sid
			}
		}

		return null
	}
}

export { RNTwilioPhone }
