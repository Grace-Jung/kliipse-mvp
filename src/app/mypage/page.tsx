import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("user-token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userId: string;
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (!payload.id || (payload.exp && payload.exp < Date.now())) {
      redirect("/login");
    }
    userId = payload.id;
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      serviceRequests: {
        include: { payments: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const allPayments = user.serviceRequests.flatMap((req) =>
    req.payments.map((p) => ({ ...p, customerName: req.customerName }))
  );
  allPayments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const serviceTypeLabels: Record<string, string> = {
    DJ_BOOKING: "DJ 섭외",
    EQUIPMENT_RENTAL: "장비 대여",
    SOUND_INSTALLATION: "음향 시공",
  };

  const methodLabels: Record<string, string> = {
    CARD: "카드",
    BANK_TRANSFER: "계좌이체",
    KAKAO_PAY: "카카오페이",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-white mb-8">마이페이지</h1>

        {/* Profile Section */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#ADFF2F]/20 text-[#ADFF2F] text-2xl font-bold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
              {user.phone && (
                <p className="text-gray-400 text-sm">{user.phone}</p>
              )}
              <p className="text-gray-500 text-xs">
                가입일: {new Date(user.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </div>
          </div>
        </div>

        {/* Service Requests */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            내 견적 요청
          </h2>
          {user.serviceRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                아직 견적 요청 내역이 없습니다.
              </p>
              <Link
                href="/quote"
                className="inline-block rounded-lg bg-[#ADFF2F] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#9be62b]"
              >
                견적 요청하기
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-gray-400">
                    <th className="text-left py-3 px-3 font-medium">
                      서비스 유형
                    </th>
                    <th className="text-left py-3 px-3 font-medium">
                      행사 날짜
                    </th>
                    <th className="text-left py-3 px-3 font-medium">장소</th>
                    <th className="text-left py-3 px-3 font-medium">상태</th>
                    <th className="text-left py-3 px-3 font-medium">신청일</th>
                    <th className="text-left py-3 px-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {user.serviceRequests.map((req) => {
                    const hasCompletedPayment = req.payments.some(
                      (p) => p.status === "COMPLETED"
                    );
                    const showPayButton =
                      req.status === "CONFIRMED" && !hasCompletedPayment;

                    return (
                      <tr
                        key={req.id}
                        className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                      >
                        <td className="py-3 px-3 text-gray-300">
                          {serviceTypeLabels[req.serviceType] || req.serviceType}
                        </td>
                        <td className="py-3 px-3 text-gray-300">
                          {req.eventDate}
                        </td>
                        <td className="py-3 px-3 text-gray-300">
                          {req.eventLocation}
                        </td>
                        <td className="py-3 px-3">
                          <RequestStatusBadge status={req.status} />
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-xs">
                          {new Date(req.createdAt).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="py-3 px-3">
                          {showPayButton && (
                            <Link
                              href={`/payment/${req.id}`}
                              className="inline-block rounded-md bg-[#ADFF2F] px-3 py-1 text-xs font-semibold text-[#0a0a0a] transition hover:bg-[#9be62b]"
                            >
                              결제하기
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment History */}
        {allPayments.length > 0 && (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              결제 내역
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a2a] text-gray-400">
                    <th className="text-left py-3 px-3 font-medium">거래ID</th>
                    <th className="text-right py-3 px-3 font-medium">금액</th>
                    <th className="text-left py-3 px-3 font-medium">
                      결제방법
                    </th>
                    <th className="text-left py-3 px-3 font-medium">상태</th>
                    <th className="text-left py-3 px-3 font-medium">결제일</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                    >
                      <td className="py-3 px-3 text-white font-mono text-xs">
                        {payment.transactionId || "-"}
                      </td>
                      <td className="py-3 px-3 text-right text-white font-medium">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="py-3 px-3 text-gray-300">
                        {methodLabels[payment.method] || payment.method}
                      </td>
                      <td className="py-3 px-3">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString("ko-KR")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-[#ADFF2F]/10 text-[#ADFF2F] border-[#ADFF2F]/30",
    CONTACTED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    QUOTED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    CONFIRMED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const labels: Record<string, string> = {
    NEW: "신규",
    CONTACTED: "연락완료",
    QUOTED: "견적전달",
    CONFIRMED: "확정",
    CANCELLED: "취소",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-500/10 text-green-400 border-green-500/30",
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    REFUNDED: "bg-red-500/10 text-red-400 border-red-500/30",
    FAILED: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  };

  const labels: Record<string, string> = {
    COMPLETED: "완료",
    PENDING: "대기",
    REFUNDED: "환불",
    FAILED: "실패",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
        styles[status] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
