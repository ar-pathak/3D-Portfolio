import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory'

export const useWebXR = (options = {}) => {
  const {
    renderer,
    scene,
    camera,
    onSessionStart,
    onSessionEnd,
    onControllerSelect,
    onControllerSqueeze,
    onHandGrip,
    onHandPinch,
    enableAR = false,
    enableHandTracking = false
  } = options

  const [isVRSupported, setIsVRSupported] = useState(false)
  const [isARSupported, setIsARSupported] = useState(false)
  const [isHandTrackingSupported, setIsHandTrackingSupported] = useState(false)
  const [isSessionActive, setIsSessionActive] = useState(false)

  const controllerRefs = useRef([])
  const handRefs = useRef([])
  const buttonRef = useRef(null)

  // Check WebXR support
  useEffect(() => {
    const checkSupport = async () => {
      if ('xr' in navigator) {
        // Check VR support
        const vrSupported = await navigator.xr.isSessionSupported('immersive-vr')
        setIsVRSupported(vrSupported)

        // Check AR support
        if (enableAR) {
          const arSupported = await navigator.xr.isSessionSupported('immersive-ar')
          setIsARSupported(arSupported)
        }

        // Check hand tracking support
        if (enableHandTracking) {
          const handTrackingSupported = await navigator.xr.isSessionSupported('immersive-vr', {
            requiredFeatures: ['hand-tracking']
          })
          setIsHandTrackingSupported(handTrackingSupported)
        }
      }
    }

    checkSupport()
  }, [enableAR, enableHandTracking])

  // Setup WebXR
  useEffect(() => {
    if (!renderer || !scene || !camera) return

    // Setup renderer for WebXR
    renderer.xr.enabled = true
    renderer.xr.setReferenceSpaceType('local')

    // Create controllers
    const controllerModelFactory = new XRControllerModelFactory()
    const handModelFactory = new XRHandModelFactory()

    // Setup controllers
    const controller1 = renderer.xr.getController(0)
    const controller2 = renderer.xr.getController(1)
    controllerRefs.current = [controller1, controller2]

    // Add controller models
    const controllerGrip1 = renderer.xr.getControllerGrip(0)
    const controllerGrip2 = renderer.xr.getControllerGrip(1)
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))
    scene.add(controllerGrip1)
    scene.add(controllerGrip2)

    // Setup hands if supported
    if (isHandTrackingSupported) {
      const hand1 = renderer.xr.getHand(0)
      const hand2 = renderer.xr.getHand(1)
      handRefs.current = [hand1, hand2]

      hand1.add(handModelFactory.createHandModel(hand1, 'mesh'))
      hand2.add(handModelFactory.createHandModel(hand2, 'mesh'))
      scene.add(hand1)
      scene.add(hand2)
    }

    // Add VR/AR button
    const button = enableAR ? ARButton.createButton(renderer) : VRButton.createButton(renderer)
    buttonRef.current = button
    document.body.appendChild(button)

    // Handle controller events
    const handleControllerSelect = (event) => {
      onControllerSelect?.(event)
    }

    const handleControllerSqueeze = (event) => {
      onControllerSqueeze?.(event)
    }

    controller1.addEventListener('select', handleControllerSelect)
    controller2.addEventListener('select', handleControllerSelect)
    controller1.addEventListener('squeeze', handleControllerSqueeze)
    controller2.addEventListener('squeeze', handleControllerSqueeze)

    // Handle hand events
    const handleHandGrip = (event) => {
      onHandGrip?.(event)
    }

    const handleHandPinch = (event) => {
      onHandPinch?.(event)
    }

    if (isHandTrackingSupported) {
      hand1.addEventListener('grip', handleHandGrip)
      hand2.addEventListener('grip', handleHandGrip)
      hand1.addEventListener('pinch', handleHandPinch)
      hand2.addEventListener('pinch', handleHandPinch)
    }

    // Handle session events
    const handleSessionStart = () => {
      setIsSessionActive(true)
      onSessionStart?.()
    }

    const handleSessionEnd = () => {
      setIsSessionActive(false)
      onSessionEnd?.()
    }

    renderer.xr.addEventListener('sessionstart', handleSessionStart)
    renderer.xr.addEventListener('sessionend', handleSessionEnd)

    // Cleanup
    return () => {
      if (buttonRef.current) {
        document.body.removeChild(buttonRef.current)
      }

      controller1.removeEventListener('select', handleControllerSelect)
      controller2.removeEventListener('select', handleControllerSelect)
      controller1.removeEventListener('squeeze', handleControllerSqueeze)
      controller2.removeEventListener('squeeze', handleControllerSqueeze)

      if (isHandTrackingSupported) {
        hand1.removeEventListener('grip', handleHandGrip)
        hand2.removeEventListener('grip', handleHandGrip)
        hand1.removeEventListener('pinch', handleHandPinch)
        hand2.removeEventListener('pinch', handleHandPinch)
      }

      renderer.xr.removeEventListener('sessionstart', handleSessionStart)
      renderer.xr.removeEventListener('sessionend', handleSessionEnd)
    }
  }, [renderer, scene, camera, enableAR, enableHandTracking, isHandTrackingSupported])

  return {
    isVRSupported,
    isARSupported,
    isHandTrackingSupported,
    isSessionActive,
    controllers: controllerRefs.current,
    hands: handRefs.current
  }
}

// WebXR utility functions
export const webXRUtils = {
  // Controller helpers
  controller: {
    getPosition: (controller) => controller.position,
    getRotation: (controller) => controller.rotation,
    getMatrix: (controller) => controller.matrix,
    getTargetRaySpace: (controller) => controller.targetRaySpace,
    getGripSpace: (controller) => controller.gripSpace
  },

  // Hand helpers
  hand: {
    getJoints: (hand) => hand.joints,
    getFingerTip: (hand, finger) => hand.joints[`${finger}-tip`],
    getFingerBase: (hand, finger) => hand.joints[`${finger}-base`],
    isPinching: (hand) => hand.joints['index-tip'].position.distanceTo(hand.joints['thumb-tip'].position) < 0.02,
    isGripping: (hand) => hand.joints['middle-tip'].position.distanceTo(hand.joints['palm-base'].position) < 0.05
  },

  // Space helpers
  space: {
    getPosition: (space) => space.position,
    getRotation: (space) => space.rotation,
    getMatrix: (space) => space.matrix,
    getOriginOffset: (space) => space.originOffset
  },

  // Session helpers
  session: {
    getMode: (session) => session.mode,
    getReferenceSpace: (session) => session.referenceSpace,
    getVisibilityState: (session) => session.visibilityState,
    getFrameRate: (session) => session.frameRate,
    getRenderState: (session) => session.renderState
  }
} 