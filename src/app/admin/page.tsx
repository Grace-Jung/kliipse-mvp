import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRequests,
    newRequests,
    totalArtists,
    totalEquipment,
    totalCustomers,
    recentRequests,
    completedPayments,
    recentPayments,
  ] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: "NEW" } }),
    prisma.artist.count(),
    prisma.equipment.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.payment.findMany({ where: { status: "COMPLETED" } }),
    prisma.payment.findMany({
      include: { serviceRequest: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalPaymentAmount = completedPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const thisMonthRevenue = completedPayments
    .filter((p) => p.paidAt && new Date(p.paidAt) >= thisMonthStart)
    .reduce((sum, p) => sum + p.amount, 0);

  const summaryCards = [
    { label: "총 견적 요청", value: totalRequests, color: "text-[#ADFF2F]" },
    { label: "신규 요청", value: newRequests, color: "text-green-400" },
    { label: "등록된 아티스트", value: totalArtists, color: "text-blue-400" },
    { label: "등록된 장비", value: totalEquipment, color: "text-purple-400" },
    { label: "총 회원 수", value: totalCustomers, color: "text-cyan-400" },
    {
      label: "총 결제 금액",
      value: `${totalPaymentAmount.toLocaleString()}원`,
      color: "text-[#ADFF2F]",
    },
    {
      label: "이번 달 매출",
      value: `${thisMonthRevenue.toLocaleString()}원`,
      color: "text-[#ADFF2F]",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">대시보드</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5"
          >
            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">최근 견적 요청</h2>
        {recentRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">아직 견적 요청이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400">
                  <th className="text-left py-3 px-2 font-medium">고객명</th>
                  <th className="text-left py-3 px-2 font-medium">서비스 유형</th>
                  <th className="text-left py-3 px-2 font-medium">행사일</th>
                  <th className="text-left py-3 px-2 font-medium">상태</th>
                  <th className="text-left py-3 px-2 font-medium">요청일</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req.id} className="border-b border-[#1f1f1f] hover:bg-[#222] transition">
                    <td className="py-3 px-2 text-white">{req.customerName}</td>
                    <td className="py-3 px-2 text-gray-300">{req.serviceType}</td>
                    <td className="py-3 px-2 text-gray-300">{req.eventDate}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-2 text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">최근 결제</h2>
        {recentPayments.length === 0 ? (
          <p className="text-gray-500 text-sm">아직 결제 내역이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400">
                  <th className="text-left py-3 px-2 font-medium">고객명</th>
                  <th className="text-right py-3 px-2 font-medium">금액</th>
                  <th className="text-left py-3 px-2 font-medium">상태</th>
                  <th className="text-left py-3 px-2 font-medium">결제일</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                  >
                    <td className="py-3 px-2 text-white">
                      {payment.serviceRequest.customerName}
                    </td>
                    <td className="py-3 px-2 text-right text-white font-medium">
                      {payment.amount.toLocaleString()}원
                    </td>
                    <td className="py-3 px-2">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="py-3 px-2 text-gray-400">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString("ko-KR")
                        : "-"}
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NEW: "bg-green-500/10 text-green-400 border-green-500/30",
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
