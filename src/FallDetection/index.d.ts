import { NativeEventEmitter } from 'react-native'

/**
 * Provides access to background sensor reading service.
 */
declare module FallDetectionService {}

export const FALL_DETECTED
export const FALL_DETECTION_STARTED
export const FALL_DETECTION_STOPPED

export function getSecret(ans: number): Promise<string>

/**
 * Lmao I hope it works
 * @param interval time between sensor polls in microseconds
 * @param maxDelay max delay allowed for power saving reasons in microseconds
 */
export function startFallDetectionService(interval?: number, maxDelay?: number): void

export function stopFallDetectionService()

export function isServiceRunning(): Promise<boolean>

export const emergencyEventEmitter: NativeEventEmitter
