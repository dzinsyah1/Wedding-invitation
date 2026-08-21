const KEY = "wedding_analytics";

export function track(event: string, extra?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    at: new Date().toISOString(),
    ...extra,
  };

  try {
    const prev = JSON.parse(localStorage.getItem(KEY) || "[]") as unknown[];
    prev.push(payload);
    localStorage.setItem(KEY, JSON.stringify(prev.slice(-80)));
  } catch {
    /* ignore quota */
  }
}
