import { useStore } from "../../store/store";

export default function VideoPlayer() {
  const { videoSrc } = useStore();
  return <video width="600" controls src={videoSrc} />;
}
