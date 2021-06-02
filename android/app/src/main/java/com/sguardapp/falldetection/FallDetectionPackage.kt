package com.sguardapp.falldetection

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class FallDetectionPackage : ReactPackage {
    override fun createNativeModules(ctx: ReactApplicationContext) =
        listOf(
            FallDetectionModule(ctx)
        )

    override fun createViewManagers(ctx: ReactApplicationContext) =
        emptyList<ViewManager<View, ReactShadowNode<*>>>()
}