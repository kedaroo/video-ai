import { create } from "zustand";

type Store = {
  videoSrc: string;
  videoPlayerRef: React.MutableRefObject<HTMLVideoElement | null> | null;
  setVideoSrc: (videoSrc: string) => void;
  setVideoPlayerRef: (videoSrc: React.MutableRefObject<HTMLVideoElement | null>) => void;
};

export const useStore = create<Store>()((set) => ({
  videoSrc: "",
  videoPlayerRef: null,
  setVideoSrc: (videoSrc) => set(() => ({ videoSrc })),
  setVideoPlayerRef: (videoPlayerRef) => set(() => ({ videoPlayerRef })),
}));
