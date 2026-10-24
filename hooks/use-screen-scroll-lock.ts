"use client"

import { useEffect } from "react"

// Ref-counted so overlapping full-screen overlays (loader → envelope) never unlock each other
let lockCount = 0

const preventTouchScroll = (e: TouchEvent) => {
  if (e.touches.length === 1) e.preventDefault()
}

function lock() {
  lockCount += 1
  if (lockCount > 1) return
  const html = document.documentElement
  const body = document.body
  html.style.overflow = "hidden"
  html.style.overscrollBehavior = "none"
  body.style.overflow = "hidden"
  body.style.overscrollBehavior = "none"
  // iOS Safari ignores overflow: hidden for touch scrolling
  document.addEventListener("touchmove", preventTouchScroll, { passive: false })
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0) return
  const html = document.documentElement
  const body = document.body
  html.style.overflow = ""
  html.style.overscrollBehavior = ""
  body.style.overflow = ""
  body.style.overscrollBehavior = ""
  document.removeEventListener("touchmove", preventTouchScroll)
}

/** Locks page scroll (including iOS touch scroll) while a full-screen overlay is shown. */
export function useScreenScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    lock()
    return unlock
  }, [locked])
}
