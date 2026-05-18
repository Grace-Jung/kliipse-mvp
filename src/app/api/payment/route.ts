import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const paymentSchema = z.object({
  serviceRequestId: z.string().min(1, "서비스 요청 ID가 필요합니다."),
  amount: z.number().positive("결제 금액은 0보다 커야 합니다."),
  method: z.enum(["CARD", "BANK_TRANSFER", "KAKAO_PAY"]),
  cardNumber: z.string().optional(),
  bankName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "입력값이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const { serviceRequestId, amount, method, cardNumber, bankName } = parsed.data;

    // Verify the service request exists
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, error: "견적 요청을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Generate fake transaction ID
    const transactionId = `TXN-${Date.now()}`;

    // Mask card number (show last 4 digits only)
    let maskedCardNumber: string | null = null;
    if (method === "CARD" && cardNumber) {
      const digits = cardNumber.replace(/\D/g, "");
      const last4 = digits.slice(-4);
      maskedCardNumber = `****-****-****-${last4}`;
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        serviceRequestId,
        amount,
        method,
        status: "COMPLETED",
        cardNumber: maskedCardNumber,
        bankName: method === "BANK_TRANSFER" ? bankName || null : null,
        transactionId,
        paidAt: new Date(),
      },
    });

    // Update service request status to CONFIRMED
    await prisma.serviceRequest.update({
      where: { id: serviceRequestId },
      data: { status: "CONFIRMED" },
    });

    return NextResponse.json(
      { success: true, paymentId: payment.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("결제 처리 오류:", error);
    return NextResponse.json(
      { success: false, error: "결제 처리 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
