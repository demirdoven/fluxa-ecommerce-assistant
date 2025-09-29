import { NextRequest, NextResponse } from "next/server";
import { getReplicaHistory } from "../../../../lib/sensay/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const missing: string[] = [];
    if (!process.env.SENSAY_ORG_SECRET) missing.push("SENSAY_ORG_SECRET");
    if (!process.env.SENSAY_REPLICA_UUID) missing.push("SENSAY_REPLICA_UUID");
    if (missing.length) {
      return new NextResponse(
        `Missing env vars: ${missing.join(", ")}\nAdd them to .env.local and restart the dev server.`,
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const cursor = searchParams.get("cursor") || undefined;
    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;

    if (!userId) {
      return new NextResponse("Missing 'userId'", { status: 400 });
    }

    const data = await getReplicaHistory(
      {
        ...(limit ? { limit: Number(limit) } : {}),
        ...(cursor ? { cursor } : {}),
        ...(start ? { start } : {}),
        ...(end ? { end } : {}),
      },
      userId
    );

    return NextResponse.json(data ?? {});
  } catch (err: any) {
    const msg = err?.message || "Internal error";
    console.error("/api/sensay/history error:", err);
    return new NextResponse(`Error: ${msg}`, { status: 500 });
  }
}
