package com.sguardapp.falldetection

import android.app.ActivityManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Context.NOTIFICATION_SERVICE
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorManager
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.sguardapp.R

// https://developer.android.com/guide/topics/sensors/sensors_overview
class FallDetectionModule(ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {

    private val tag = "FallDetectionModule"
    private val sensorManager =
        ctx.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val activityManager =
        ctx.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
    private val notificationManager =
        ctx.getSystemService(NOTIFICATION_SERVICE) as NotificationManager
    private val linAccelSensor =
        sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION)

    private var test: Int? = null

    companion object {
        const val channelId = "com.sguardapp.falldetection"
        const val FALL_DETECTED = "FALL_DETECTED"
        const val FALL_DETECTION_STARTED = "FALL_DETECTION_STARTED"
        const val FALL_DETECTION_STOPPED = "FALL_DETECTION_STOPPED"
    }

    override fun getConstants() = HashMap<String, String>().apply {
        put(FALL_DETECTED, FALL_DETECTED)
        put(FALL_DETECTION_STARTED, FALL_DETECTION_STARTED)
        put(FALL_DETECTION_STOPPED, FALL_DETECTION_STOPPED)
    }

    /*
     * So primary constructor (super()) runs first, then init block,
     * then any secondary constructors (which might change the constructor signature).
     * And implied primary constructors are a thing huh?
     */
    init {
        test = 1
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            with(reactApplicationContext) {
                NotificationChannel(
                    channelId,
                    getString(R.string.channel_name),
                    NotificationManager.IMPORTANCE_DEFAULT
                ).let {
                    it.description = getString(R.string.channel_description)
                    notificationManager.createNotificationChannel(it)
                }
            }
        }
    }

    override fun getName() = "FallDetectionModule"

    /**
     * interval in microseconds between reads
     * maxDelay in microseconds for reads to be delivered
     */
    @ReactMethod
    fun startFallDetectionService(interval: Double, maxDelay: Double) {
        Log.d(tag, "Starting Service")
        with(reactApplicationContext) {
            Intent(this, FallDetectionService::class.java).run {
                putExtra("interval", interval.toInt())
                putExtra("maxDelay", maxDelay.toInt())
            }
                .let(
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                        ::startForegroundService
                    else
                        ::startService
                )
        }
        Log.d(tag, "Started Service")
    }

    @ReactMethod
    fun isServiceRunning(promise: Promise) {
        promise.resolve(activityManager.getRunningServices(Integer.MAX_VALUE)
            .any { it.service.className == FallDetectionService::class.java.name })
    }

    @ReactMethod
    fun stopFallDetectionService() {
        reactApplicationContext.stopService(
            Intent(
                reactApplicationContext,
                FallDetectionService::class.java
            )
        )
    }

    @ReactMethod
    fun getSecret(ans: Int, promise: Promise) =
        promise.resolve(if (ans == test) "Test Succeeded!" else "Test Failed...")

    @ReactMethod
    fun isAvailable(promise: Promise) = promise.resolve(linAccelSensor != null)
}