import { NextRequest, NextResponse } from "next/server";

const API_VERSION = "2025-03-25";
const SENSAY_BASE_URL = "https://api.sensay.io";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const missing: string[] = [];
    if (!process.env.SENSAY_ORG_SECRET) missing.push("SENSAY_ORG_SECRET");
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing env vars: ${missing.join(", ")}` },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const email: string | undefined = body?.email ? String(body.email) : undefined;
    const id: string | undefined = body?.id ? String(body.id) : undefined;
    const name: string | undefined = body?.name ? String(body.name) : undefined;
    const linkedAccounts: any[] = Array.isArray(body?.linkedAccounts) ? body.linkedAccounts : [];

    if (!email || !id) {
      return NextResponse.json(
        { success: false, error: "Missing 'email' or 'id'" },
        { status: 400 }
      );
    }

    const resp = await fetch(`${SENSAY_BASE_URL}/v1/users`, {
      method: "POST",
      headers: {
        "X-ORGANIZATION-SECRET": process.env.SENSAY_ORG_SECRET as string,
        "Content-Type": "application/json",
        "X-API-Version": API_VERSION,
        Accept: "application/json",
      },
      body: JSON.stringify({ email, id, linkedAccounts, ...(name ? { name } : {}) }),
    });

    const text = await resp.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch {}

    if (!resp.ok) {
      const msg = data?.error || data?.message || text || `HTTP ${resp.status}`;
      return NextResponse.json({ success: false, status: resp.status, error: String(msg) }, { status: resp.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("/api/sensay/users error:", err);
    const msg = err?.message || "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
