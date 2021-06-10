package com.sguardapp.falldetection

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.IBinder
import android.util.Log
import androidx.annotation.Nullable
import androidx.core.app.NotificationCompat
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.sguardapp.MainApplication
import com.sguardapp.R
import kotlin.math.absoluteValue

/*
 * let & also store the original object as "it"
 * run & apply store the original object in the context as "this"
 * with takes an existing object and temporarily makes it the context "this"
 * let & run return whether the operations within were successful or smth like that
 * also & apply run whatever is inside but return the original object
 * Genius scope manipulation stuff actually sasuga kotlin
 */

/*
 * Lucky for me, Android team cared about their developers. To aid migration,
 * fundamentally everything is done with a Service. Just the way the Service
 * is started changed. As such, the sensor reading code, this Service implementation,
 * and the algorithm is unlikely to change once written well.
 * But... initiateEmergency()? that is not really settled...
 *
 * see: TYPE_SIGNIFICANT_MOTION
 */
class FallDetectionService : Service(), SensorEventListener {
    private val tag = "SensorServiceModule"

    private var sensorManager: SensorManager? = null
    private var linAccelSensor: Sensor? = null

    /** interval between sensor polls in microseconds */
    private var interval = 500

    /** max delay for polls to be delivered. power saving apparently */
    private var maxDelay = 100000

    private var foregroundNotification: Notification? = null

    private val notificationId = 42069

    /** Algorithm to determine if given sensor values constitute a fall */
    private fun isOverThreshold(values: FloatArray): Boolean {
        /* TODO:
         * Instead of using a single reading, use a time-aware buffer
         * How to integrate multiple sensors?
         * Implement: https://link.springer.com/article/10.1186/s13678-016-0004-1
         */
        val (x, y, z) = values
        val v = x.absoluteValue + y.absoluteValue + z.absoluteValue
        //Log.d(TAG, String.format("Sensor Value: %f", v))
        return v > 7
    }

    private fun sendEventToJS(event:String, data:Any?=null) {
        (application as MainApplication).reactNativeHost.reactInstanceManager.currentReactContext?.getJSModule(
            DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
        )
            ?.emit(event, data)
    }

    private var lastEmergencyTimestamp: Long = 0
    private val debounceDelay = 2000
    private fun initiateEmergency() {
        if (System.currentTimeMillis() - lastEmergencyTimestamp < debounceDelay) return
        lastEmergencyTimestamp = System.currentTimeMillis()
        /*
        Intent(this, MainActivity::class.java)
            .addFlags(FLAG_ACTIVITY_NEW_TASK)
            .also(::startActivity)
         */
        sendEventToJS(FallDetectionModule.FALL_DETECTED) //send useful data
        Log.d(tag, "emergency!")
        stopSelf()
    }

    private fun buildForegroundNotification() {
        val pendingIntent = Intent(this, this::class.java).let {
            PendingIntent.getActivity(this, 0, it, 0)
        }
        foregroundNotification = NotificationCompat.Builder(this, FallDetectionModule.channelId)
            .setContentTitle(getString(R.string.foregroundServiceTitle))
            .setContentText(getString(R.string.foregroundServiceDesc))
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .build()
        startForeground(notificationId, foregroundNotification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent != null) {
            interval = intent.getIntExtra("interval", interval)
            maxDelay = intent.getIntExtra("maxDelay", maxDelay)
        }

        sensorManager = (getSystemService(Context.SENSOR_SERVICE) as SensorManager).also {
            linAccelSensor = it.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION)
            it.registerListener(
                this,
                linAccelSensor,
                interval,
                maxDelay
            )
        }

        buildForegroundNotification()

        sendEventToJS(FallDetectionModule.FALL_DETECTION_STARTED)
        return START_STICKY
    }

    override fun onDestroy() {
        sensorManager?.unregisterListener(this)
        sendEventToJS(FallDetectionModule.FALL_DETECTION_STOPPED)
        super.onDestroy()
    }

    /** Handler for new sensor reading */
    override fun onSensorChanged(event: SensorEvent) {
        if (isOverThreshold(event.values)) initiateEmergency()
        /* TODO:
         * Currently service stops after a single read,
         * might want to persist longer & take multiple readings?
         * ^but above might make reading intervals inconsistent
         * How to pass previous readings between start and stop..
         * ^ Not necessary on smaller timescales or something
         */
    }

    /** Handler for if sensor accuracy changes. Kinda unnecessary */
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit

    override fun onBind(intent: Intent): IBinder {
        TODO("Return the communication channel to the service.")
    }
}