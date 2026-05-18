import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod/v4";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  stageName: z.string().min(1).optional(),
  genres: z.string().min(1).optional(),
  careerYears: z.number().int().min(0).optional(),
  location: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  profileImage: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  basePrice: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const artist = await prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return NextResponse.json({ error: "아티스트를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(artist);
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

    const artist = await prisma.artist.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(artist);
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
    await prisma.artist.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
  }
}
