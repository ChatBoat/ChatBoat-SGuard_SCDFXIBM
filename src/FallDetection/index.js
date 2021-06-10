import { NativeModules, NativeEventEmitter } from 'react-native'
const { FallDetectionModule } = NativeModules
export const { FALL_DETECTED, FALL_DETECTION_STARTED, FALL_DETECTION_STOPPED } =
	FallDetectionModule.getConstants()

export function startFallDetectionService(interval = 500, maxDelay = 100000) {
	FallDetectionModule.startFallDetectionService(interval, maxDelay)
}

export function getSecret(ans) {
	return FallDetectionModule.getSecret(ans)
}

export function stopFallDetectionService() {
	FallDetectionModule.stopFallDetectionService()
}

export function isServiceRunning() {
	return FallDetectionModule.isServiceRunning()
}

export const emergencyEventEmitter = new NativeEventEmitter(FallDetectionModule)
