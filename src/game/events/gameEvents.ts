type Handler<T> = (payload: T) => void;

class GameEventBus {
  private listeners = new Map<string, Set<Handler<unknown>>>();

  on<T>(event: string, handler: Handler<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const wrapped = handler as Handler<unknown>;
    this.listeners.get(event)!.add(wrapped);
    return () => this.off(event, wrapped);
  }

  off(event: string, handler: Handler<unknown>) {
    this.listeners.get(event)?.delete(handler);
  }

  emit<T>(event: string, payload?: T) {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }
}

export const gameEvents = new GameEventBus();

export const GAME_EVENTS = {
  LOAD_PROGRESS: "LOAD_PROGRESS",
  GAME_READY: "GAME_READY",
  GAME_ERROR: "GAME_ERROR",
  ENTER_WORLD: "ENTER_WORLD",
  OPEN_MODAL: "OPEN_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
  SHOW_PROMPT: "SHOW_PROMPT",
  HIDE_PROMPT: "HIDE_PROMPT",
  NAVIGATE_TO: "NAVIGATE_TO",
  MOVE: "MOVE",
  JUMP: "JUMP",
  INTERACT: "INTERACT",
  TOGGLE_MUSIC: "TOGGLE_MUSIC",
  MODAL_STATE: "MODAL_STATE",
  LOCATION_VISITED: "LOCATION_VISITED",
} as const;

export type ModalType =
  | "welcome"
  | "couple"
  | "story"
  | "event"
  | "countdown"
  | "gallery"
  | "rsvp"
  | "gift"
  | "thanks";

export interface OpenModalPayload {
  type: ModalType;
  locationId: string;
  eventId?: string;
}

export interface PromptPayload {
  label: string;
  locationId: string;
  desktop: string;
}
