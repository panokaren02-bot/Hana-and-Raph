"use client"

import { useState } from "react"
import Image from "next/image"

/**
 * Layered photo slideshow: the incoming photo fades in on top of the outgoing one
 * (which stays fully visible underneath), and only once it has loaded. The slow zoom
 * keeps drifting through the change, so nothing snaps.
 */
export function CrossfadeImages({
  images,
  active,
  sizes,
  alt = "",
  className = "",
  reduceMotion = false,
}: {
  images: string[]
  active: number
  sizes: string
  /** Alt text for the first photo; the rest are decorative */
  alt?: string
  className?: string
  reduceMotion?: boolean | null
}) {
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set())
  // `prev` is the photo that was actually on screen when `active` last changed. It is
  // derived during render (not in an effect) so the outgoing photo is never left
  // unclassed for a frame — that gap made it start fading out and flicker back.
  const [track, setTrack] = useState<{ active: number; prev: number | null }>({ active, prev: null })
  // Mount a photo only once it is (or is about to be) on screen
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1 % Math.max(images.length, 1)]))

  if (track.active !== active) {
    const shown = loaded.has(track.active) ? track.active : track.prev
    setTrack({ active, prev: shown === active ? track.prev : shown })
  }
  const next = (active + 1) % images.length
  if (!seen.has(active) || !seen.has(next)) {
    setSeen(new Set(seen).add(active).add(next))
  }

  const { prev } = track

  // Own stacking context: the photos' z-index layering must never lift them above
  // overlays (tints, scrims) that the parent paints after this component.
  return (
    <div className="absolute inset-0 isolate overflow-hidden">
      {images.map((src, i) => {
        if (!seen.has(i)) return null
        const state = i === active && loaded.has(i) ? "is-active" : i === prev ? "is-prev" : ""
        return (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? alt : ""}
            fill
            sizes={sizes}
            onLoad={() => setLoaded((l) => (l.has(i) ? l : new Set(l).add(i)))}
            className={`crossfade-img ${reduceMotion ? "crossfade-img--still" : ""} ${state} ${className}`}
          />
        )
      })}
    </div>
  )
}
