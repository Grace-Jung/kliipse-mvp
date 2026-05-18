import { prisma } from "@/lib/prisma";
import { RefundButton } from "./refund-button";

export const dynamic = "force-dynamic";

const methodLabels: Record<string, string> = {
  CARD: "카드",
  BANK_TRANSFER: "계좌이체",
  KAKAO_PAY: "카카오페이",
};

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/30",
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  REFUNDED: "bg-red-500/10 text-red-400 border-red-500/30",
  FAILED: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

const statusLabels: Record<string, string> = {
  COMPLETED: "완료",
  PENDING: "대기",
  REFUNDED: "환불",
  FAILED: "실패",
};

const serviceTypeLabels: Record<string, string> = {
  DJ_BOOKING: "DJ 섭외",
  EQUIPMENT_RENTAL: "장비 대여",
  SOUND_INSTALLATION: "음향 시공",
};

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { serviceRequest: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">결제 관리</h1>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {payments.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">결제 내역이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400 bg-[#151515]">
                  <th className="text-left py-3 px-4 font-medium">거래 ID</th>
                  <th className="text-left py-3 px-4 font-medium">고객명</th>
                  <th className="text-left py-3 px-4 font-medium">서비스</th>
                  <th className="text-right py-3 px-4 font-medium">결제 금액</th>
                  <th className="text-left py-3 px-4 font-medium">결제 방법</th>
                  <th className="text-left py-3 px-4 font-medium">상태</th>
                  <th className="text-left py-3 px-4 font-medium">결제일</th>
                  <th className="text-left py-3 px-4 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                  >
                    <td className="py-3 px-4 text-gray-300 font-mono text-xs">
                      {payment.transactionId || "-"}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {payment.serviceRequest.customerName}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {serviceTypeLabels[payment.serviceRequest.serviceType] ||
                        payment.serviceRequest.serviceType}
                    </td>
                    <td className="py-3 px-4 text-right text-white font-medium">
                      {payment.amount.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {methodLabels[payment.method] || payment.method}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                          statusStyles[payment.status] ||
                          "bg-gray-500/10 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        {statusLabels[payment.status] || payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString("ko-KR")
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {payment.status === "COMPLETED" && (
                        <RefundButton paymentId={payment.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
