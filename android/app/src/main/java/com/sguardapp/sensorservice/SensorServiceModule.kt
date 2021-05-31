package com.sguardapp.sensorservice

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

//https://developer.android.com/guide/topics/sensors/sensors_overview
class SensorServiceModule(ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {

    private var test: Int? = null

    /*
     * So primary constructor (super()) runs first, then init block,
     * then any secondary constructors (which might change the constructor signature).
     * And implied primary constructors are a thing huh?
     */
    init {
        test = 1
    }

    override fun getName() = "SensorServiceModule"

    @ReactMethod
    fun getSecret(ans: Int, promise: Promise) =
        promise.resolve(if (ans == test) "Test Succeeded!" else "Test Failed...")
}