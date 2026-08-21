import { NextRequest, NextResponse } from "next/server";

const rsvps: Array<{
  name: string;
  attendance: string;
  guests: number;
  message: string;
  createdAt: string;
}> = [];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name || "").trim();
  const attendance = String(body.attendance || "yes");
  const guests = Math.max(1, Math.min(8, Number(body.guests) || 1));
  const message = String(body.message || "").slice(0, 500);

  if (!name) {
    return NextResponse.json({ ok: false, error: "Nama wajib diisi." }, { status: 400 });
  }

  rsvps.push({
    name,
    attendance,
    guests,
    message,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ count: rsvps.length });
}
