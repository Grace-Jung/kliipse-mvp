import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod/v4";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  serviceType: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().optional(),
  resultSummary: z.string().min(1).optional(),
});

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const successCase = await prisma.successCase.findUnique({ where: { id } });

    if (!successCase) {
      return NextResponse.json({ error: "사례를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(successCase);
  } catch {
    return NextResponse.json({ error: "조회에 실패했습니다." }, { status: 500 });
  }
}

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
        { error: parsed.error.issues[0]?.message || "유효하지 않은 데이터입니다." },
        { status: 400 }
      );
    }

    const successCase = await prisma.successCase.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(successCase);
  } catch {
    return NextResponse.json({ error: "수정에 실패했습니다." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    await prisma.successCase.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
  }
}
