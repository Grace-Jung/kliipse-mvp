import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const artistSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  stageName: z.string().min(1, "활동명을 입력해주세요."),
  genres: z.string().min(1, "장르를 입력해주세요."),
  careerYears: z.number().int().min(0),
  location: z.string().min(1, "지역을 입력해주세요."),
  bio: z.string().min(1, "소개를 입력해주세요."),
  profileImage: z.string().optional().default(""),
  rating: z.number().min(0).max(5).optional().default(0),
  basePrice: z.number().int().min(0),
  isActive: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(artists);
  } catch {
    return NextResponse.json({ error: "조회에 실패했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = artistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "유효하지 않은 데이터입니다." },
        { status: 400 }
      );
    }

    const artist = await prisma.artist.create({
      data: parsed.data,
    });

    return NextResponse.json(artist, { status: 201 });
  } catch {
    return NextResponse.json({ error: "생성에 실패했습니다." }, { status: 500 });
  }
}
