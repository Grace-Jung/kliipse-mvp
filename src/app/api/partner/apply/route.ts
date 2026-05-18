import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, stageName, genres, careerYears, location, bio, portfolioUrl } = body;

    if (!userId || !stageName || !genres?.length || careerYears == null || !location || !bio) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해 주세요." }, { status: 400 });
    }

    // Check user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    // Check if already applied
    const existing = await prisma.partnerApplication.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ error: "이미 파트너 신청을 하셨습니다. 관리자 검토 중입니다." }, { status: 400 });
    }

    // Create application
    const application = await prisma.partnerApplication.create({
      data: {
        userId,
        stageName,
        genres: JSON.stringify(genres),
        careerYears: Number(careerYears),
        location,
        bio,
        portfolioUrl: portfolioUrl || null,
      },
    });

    // Update user role to PARTNER (pending partner)
    await prisma.user.update({
      where: { id: userId },
      data: { role: "PARTNER" },
    });

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
