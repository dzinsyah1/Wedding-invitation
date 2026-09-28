import { NextRequest, NextResponse } from "next/server";

// RSVPs are appended to a Google Sheet through an Apps Script web app
// (see scripts/rsvp-google-sheet.gs). The secret keeps others from writing
// to the sheet by calling the Apps Script URL directly.
const SHEET_URL = process.env.RSVP_SHEET_URL;
const SHEET_SECRET = process.env.RSVP_SHEET_SECRET;

const ATTENDANCE_LABEL: Record<string, string> = {
  yes: "Hadir",
  no: "Tidak hadir",
  maybe: "Belum pasti",
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Data tidak valid." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const attendance = ATTENDANCE_LABEL[String(body.attendance)] ? String(body.attendance) : "yes";
  const guests = attendance === "no" ? 0 : Math.max(1, Math.min(8, Number(body.guests) || 1));
  const message = String(body.message || "").trim().slice(0, 500);
  const invitee = String(body.invitee || "").trim().slice(0, 120);

  if (!name) {
    return NextResponse.json({ ok: false, error: "Nama wajib diisi." }, { status: 400 });
  }

  const row = { name, attendance: ATTENDANCE_LABEL[attendance], guests, message, invitee };

  if (!SHEET_URL || !SHEET_SECRET) {
    // Local development without the sheet configured: accept and log instead of failing.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[rsvp] RSVP_SHEET_URL / RSVP_SHEET_SECRET not set; not saved:", row);
      return NextResponse.json({ ok: true, stored: false });
    }
    console.error("[rsvp] RSVP_SHEET_URL / RSVP_SHEET_SECRET missing in production");
    return NextResponse.json({ ok: false, error: "RSVP belum dikonfigurasi." }, { status: 503 });
  }

  try {
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...row, secret: SHEET_SECRET }),
      // Apps Script answers with a redirect to the result; follow it.
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!result && res.url.includes("accounts.google.com")) {
      console.error(
        "[rsvp] Apps Script redirected to Google sign-in: set the web app deployment's " +
          '"Who has access" to "Anyone" (Deploy → Manage deployments → Edit → New version).'
      );
      return NextResponse.json({ ok: false, error: "Gagal menyimpan RSVP." }, { status: 502 });
    }
    if (!res.ok || !result?.ok) {
      console.error("[rsvp] sheet rejected:", res.status, result?.error);
      return NextResponse.json({ ok: false, error: "Gagal menyimpan RSVP." }, { status: 502 });
    }
  } catch (err) {
    console.error("[rsvp] sheet request failed:", err);
    return NextResponse.json({ ok: false, error: "Gagal menyimpan RSVP." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
