import { prisma } from "@/lib/prisma";
import { quoteRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = quoteRequestSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return Response.json(
        { success: false, errors },
        { status: 400 },
      );
    }

    const data = result.data;
    const userId = body.userId as string | undefined;

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        userId: userId || null,
        serviceType: data.serviceType,
        eventDate: data.eventDate,
        eventLocation: data.eventLocation,
        eventType: data.eventType,
        budget: data.budget,
        message: data.message || null,
      },
    });

    return Response.json(
      { success: true, id: serviceRequest.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("견적 요청 처리 오류:", error);
    return Response.json(
      { success: false, errors: [{ field: "server", message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }] },
      { status: 500 },
    );
  }
}
