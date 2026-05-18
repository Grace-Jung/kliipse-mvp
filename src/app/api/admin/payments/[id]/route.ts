import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod/v4";

const updateSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "REFUNDED", "FAILED"]),
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

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      return NextResponse.json(
        { error: "결제를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Handle refund
    if (parsed.data.status === "REFUNDED") {
      const updated = await prisma.payment.update({
        where: { id },
        data: {
          status: "REFUNDED",
          refundedAt: new Date(),
        },
      });

      // Also cancel the related service request
      await prisma.serviceRequest.update({
        where: { id: payment.serviceRequestId },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json(updated);
    }

    // General status update
    const updated = await prisma.payment.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "결제 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}
