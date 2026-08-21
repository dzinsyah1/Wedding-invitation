import { create } from "zustand";
import type { ModalType, PromptPayload } from "@/game/events/gameEvents";

export type AppPhase = "loading" | "opening" | "playing" | "fallback";

interface InvitationState {
  phase: AppPhase;
  progress: number;
  guestName: string;
  musicOn: boolean;
  reducedMotion: boolean;
  prompt: PromptPayload | null;
  modal: ModalType | null;
  modalEventId?: string;
  instructionVisible: boolean;
  setPhase: (phase: AppPhase) => void;
  setProgress: (progress: number) => void;
  setGuestName: (name: string) => void;
  setMusicOn: (on: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setPrompt: (prompt: PromptPayload | null) => void;
  openModal: (type: ModalType, eventId?: string) => void;
  closeModal: () => void;
  setInstructionVisible: (visible: boolean) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  phase: "loading",
  progress: 0,
  guestName: "",
  musicOn: false,
  reducedMotion: false,
  prompt: null,
  modal: null,
  modalEventId: undefined,
  instructionVisible: false,
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),
  setGuestName: (guestName) => set({ guestName }),
  setMusicOn: (musicOn) => set({ musicOn }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setPrompt: (prompt) => set({ prompt }),
  openModal: (modal, modalEventId) => set({ modal, modalEventId }),
  closeModal: () => set({ modal: null, modalEventId: undefined }),
  setInstructionVisible: (instructionVisible) => set({ instructionVisible }),
}));
