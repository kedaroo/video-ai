import { create } from "zustand";

type Store = {
  videoSrc: string;
  setVideoSrc: (videoSrc: string) => void;
};

export const useStore = create<Store>()((set) => ({
  videoSrc: "",
  setVideoSrc: (videoSrc) => set(() => ({ videoSrc })),
}));
