package com.sguardapp.falldetection

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

    private val sensorManager =
        ctx.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val notificationManager =
        ctx.getSystemService(NOTIFICATION_SERVICE) as NotificationManager
    private val linAccelSensor =
        sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION)

    private var test: Int? = null

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
                    "FALL_DETECTION_SERVICE",
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
        Log.d("FallDetectionModule", "Starting Service")
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
        Log.d("FallDetectionModule", "Started Service")
    }

    @ReactMethod
    fun stopFallDetectionService() {
        //No u.
    }

    @ReactMethod
    fun getSecret(ans: Int, promise: Promise) =
        promise.resolve(if (ans == test) "Test Succeeded!" else "Test Failed...")

    @ReactMethod
    fun isAvailable(promise: Promise) = promise.resolve(linAccelSensor != null)
}