import { useEffect, useRef, useState } from 'react'

const LOAD_TIMEOUT_MS = 8000

/**
 * Drives a set of videos from a single 0→1 progress value: the range is split
 * evenly between the videos, and the active one is seeked to the matching time.
 * Only one seek per video is in flight; newer targets wait for `seeked`.
 */
export function useScrubVideos(count: number) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const seeking = useRef<boolean[]>(Array(count).fill(false))
  const pending = useRef<number[]>(Array(count).fill(-1))
  const active = useRef(-1)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)

  function seek(index: number, time: number) {
    const video = videoRefs.current[index]
    if (!video) return
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
    if (!duration) return
    const target = Math.max(0, Math.min(time, duration - 0.05))
    if (Math.abs(video.currentTime - target) < 0.01) return
    if (seeking.current[index]) {
      pending.current[index] = target
      return
    }
    seeking.current[index] = true
    pending.current[index] = -1
    video.currentTime = target
  }

  function update(progress: number) {
    const index = Math.min(count - 1, Math.floor(progress * count))
    const local = Math.max(0, Math.min(1, progress * count - index))
    if (index !== active.current) {
      videoRefs.current.forEach((video, i) => video?.classList.toggle('active', i === index))
      active.current = index
    }
    const video = videoRefs.current[index]
    if (video) seek(index, local * video.duration)
  }

  useEffect(() => {
    const videos = videoRefs.current
    const loaded = Array(count).fill(false)

    const cleanups = videos.map((video, i) => {
      if (!video) return () => {}
      const onMeta = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return
        loaded[i] = true
        if (loaded.every(Boolean)) setReady(true)
      }
      const onSeeked = () => {
        seeking.current[i] = false
        const next = pending.current[i]
        if (next >= 0) {
          pending.current[i] = -1
          seek(i, next)
        }
      }
      const onError = () => setError(true)

      video.addEventListener('loadedmetadata', onMeta)
      video.addEventListener('seeked', onSeeked)
      video.addEventListener('error', onError)
      if (video.readyState >= 1) onMeta()

      return () => {
        video.removeEventListener('loadedmetadata', onMeta)
        video.removeEventListener('seeked', onSeeked)
        video.removeEventListener('error', onError)
      }
    })

    const timeout = window.setTimeout(() => setReady(true), LOAD_TIMEOUT_MS)
    return () => {
      cleanups.forEach((cleanup) => cleanup())
      window.clearTimeout(timeout)
    }
  }, [count])

  return { videoRefs, ready, error, update }
}
