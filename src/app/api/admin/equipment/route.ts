import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const equipmentSchema = z.object({
  name: z.string().min(1, "장비명을 입력해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  image: z.string().optional().default(""),
  rentalPrice: z.number().int().min(0),
  specs: z.string().min(1, "스펙을 입력해주세요."),
  isAvailable: z.boolean().optional().default(true),
});

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(equipment);
  } catch {
    return NextResponse.json({ error: "조회에 실패했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = equipmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "유효하지 않은 데이터입니다." },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.create({
      data: parsed.data,
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "생성에 실패했습니다." }, { status: 500 });
  }
}
