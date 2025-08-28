import { NextRequest, NextResponse } from "next/server";
import { completeReplicaJson } from "../../../../lib/sensay/api";

// Node runtime (stream reading) is required
export const runtime = "nodejs";
// Ensure this route is never statically rendered
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    // Validate required envs early for clearer errors
    const missing: string[] = [];
    if (!process.env.SENSAY_ORG_SECRET) missing.push("SENSAY_ORG_SECRET");
    if (!process.env.SENSAY_REPLICA_UUID) missing.push("SENSAY_REPLICA_UUID");
    if (!process.env.SENSAY_MASTER_USER_ID) missing.push("SENSAY_MASTER_USER_ID");
    if (missing.length) {
      return new NextResponse(
        `Missing env vars: ${missing.join(", ")}\nAdd them to .env.local and restart the dev server.`,
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const text: string = (body?.text ?? "").toString();
    const userId: string | undefined = body?.userId ? String(body.userId) : undefined;

    if (!text || !text.trim()) {
      return new NextResponse("Missing 'text'", { status: 400 });
    }

    // Use JSON completion with only content (WP plugin parity)
    const reply = await completeReplicaJson(
      text.trim(),
      undefined,
      userId
    );

    return new NextResponse(reply || "", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    const msg = err?.message || "Internal error";
    console.error("/api/sensay/complete error:", err);
    return new NextResponse(`Error: ${msg}`, { status: 500 });
  }
}
