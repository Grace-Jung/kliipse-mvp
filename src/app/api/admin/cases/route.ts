import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const caseSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  serviceType: z.string().min(1, "서비스 유형을 선택해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  image: z.string().optional().default(""),
  resultSummary: z.string().min(1, "결과 요약을 입력해주세요."),
});

export async function GET() {
  try {
    const cases = await prisma.successCase.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cases);
  } catch {
    return NextResponse.json({ error: "조회에 실패했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = caseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "유효하지 않은 데이터입니다." },
        { status: 400 }
      );
    }

    const successCase = await prisma.successCase.create({
      data: parsed.data,
    });

    return NextResponse.json(successCase, { status: 201 });
  } catch {
    return NextResponse.json({ error: "생성에 실패했습니다." }, { status: 500 });
  }
}
