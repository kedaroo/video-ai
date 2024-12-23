import { useEffect } from "react";
import Header from "../../components/header";
import Info from "../../components/info";
import VideoPlayer from "../../components/video-player";
import Background from "./background";
import { useStore } from "../../store/store";

export default function HomeLayout() {
  const { videoSrc } = useStore();

  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Background />
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          height: "80%",
          alignItems: "center",
        }}
      >
        <Info />
        <VideoPlayer />
      </div>
    </div>
  );
}
