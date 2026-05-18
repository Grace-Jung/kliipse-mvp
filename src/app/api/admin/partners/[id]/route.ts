import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const { status, adminMemo, userId } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "유효하지 않은 상태입니다." }, { status: 400 });
    }

    // Update application
    await prisma.partnerApplication.update({
      where: { id },
      data: { status, adminMemo: adminMemo || null },
    });

    if (status === "APPROVED" && userId) {
      // Change user role to ARTIST
      await prisma.user.update({
        where: { id: userId },
        data: { role: "ARTIST" },
      });

      // Get application info to create Artist profile
      const app = await prisma.partnerApplication.findUnique({ where: { id }, include: { user: true } });
      if (app) {
        await prisma.artist.create({
          data: {
            name: app.user.name,
            stageName: app.stageName,
            genres: app.genres,
            careerYears: app.careerYears,
            location: app.location,
            bio: app.bio,
            rating: 0,
            basePrice: 0,
            isActive: true,
          },
        });
      }
    } else if (status === "REJECTED" && userId) {
      // Revert role back to CUSTOMER
      await prisma.user.update({
        where: { id: userId },
        data: { role: "CUSTOMER" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
