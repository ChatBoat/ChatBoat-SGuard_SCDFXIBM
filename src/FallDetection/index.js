import {NativeModules, NativeEventEmitter} from 'react-native';
const {FallDetectionModule} = NativeModules;

function startFallDetectionService(interval = 500, maxDelay = 100000) {
	FallDetectionModule.startFallDetectionService(interval, maxDelay);
}

function getSecret(ans) {
	return FallDetectionModule.getSecret(ans);
}

const emergencyEventEmitter = new NativeEventEmitter(FallDetectionModule);

export default {startFallDetectionService, getSecret, emergencyEventEmitter};
