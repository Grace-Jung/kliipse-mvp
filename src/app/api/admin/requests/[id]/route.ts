import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod/v4";

/* ────────────────────── GET: 개별 요청 조회 ─────────────────────── */

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { error: "요청을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(serviceRequest);
  } catch {
    return NextResponse.json(
      { error: "요청 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}

/* ────────────────────── PATCH: 상태 업데이트 ────────────────────── */

const updateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "CONFIRMED", "CANCELLED"]),
});

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "유효하지 않은 상태값입니다." },
        { status: 400 }
      );
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "요청 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}
