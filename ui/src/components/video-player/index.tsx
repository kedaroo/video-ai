import { useEffect, useRef } from "react";
import { useStore } from "../../store/store";

export default function VideoPlayer() {
  const { videoSrc, setVideoPlayerRef } = useStore();
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    setVideoPlayerRef(videoPlayerRef)
  }, [videoPlayerRef, setVideoPlayerRef])

  return <video width="600" ref={videoPlayerRef} controls src={videoSrc} />;
}
