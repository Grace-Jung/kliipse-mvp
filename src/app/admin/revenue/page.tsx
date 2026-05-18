import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const serviceTypeLabels: Record<string, string> = {
  DJ_BOOKING: "DJ 섭외",
  EQUIPMENT_RENTAL: "장비 대여",
  SOUND_INSTALLATION: "음향 시공",
};

export default async function RevenuePage() {
  const [completedPayments, refundedPayments] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "COMPLETED" },
      include: { serviceRequest: true },
    }),
    prisma.payment.findMany({
      where: { status: "REFUNDED" },
      include: { serviceRequest: true },
    }),
  ]);

  // Summary calculations
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = refundedPayments.reduce((sum, p) => sum + p.amount, 0);
  const netRevenue = totalRevenue - totalRefunded;

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthRevenue = completedPayments
    .filter((p) => p.paidAt && new Date(p.paidAt) >= thisMonthStart)
    .reduce((sum, p) => sum + p.amount, 0);

  const summaryCards = [
    { label: "총 매출", value: totalRevenue },
    { label: "이번 달 매출", value: thisMonthRevenue },
    { label: "총 환불 금액", value: totalRefunded },
    { label: "순 매출", value: netRevenue },
  ];

  // Monthly revenue (last 6 months)
  const allPayments = [...completedPayments, ...refundedPayments];
  const monthlyMap = new Map<
    string,
    { completed: number; refunded: number; count: number; refundCount: number }
  >();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, { completed: 0, refunded: 0, count: 0, refundCount: 0 });
  }

  for (const p of allPayments) {
    const date = p.paidAt || p.createdAt;
    const key = `${new Date(date).getFullYear()}-${String(new Date(date).getMonth() + 1).padStart(2, "0")}`;
    const entry = monthlyMap.get(key);
    if (entry) {
      if (p.status === "COMPLETED") {
        entry.completed += p.amount;
        entry.count++;
      } else if (p.status === "REFUNDED") {
        entry.refunded += p.amount;
        entry.refundCount++;
      }
    }
  }

  const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    ...data,
    net: data.completed - data.refunded,
  }));

  // Service type breakdown
  const serviceMap = new Map<string, number>();
  for (const p of completedPayments) {
    const type = p.serviceRequest.serviceType;
    serviceMap.set(type, (serviceMap.get(type) || 0) + p.amount);
  }
  const serviceData = Array.from(serviceMap.entries()).map(([type, amount]) => ({
    type,
    label: serviceTypeLabels[type] || type,
    amount,
  }));
  const maxServiceAmount = Math.max(...serviceData.map((s) => s.amount), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">매출 관리</h1>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5"
          >
            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-[#ADFF2F]">
              {card.value.toLocaleString()}
              <span className="text-lg ml-1">원</span>
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">월별 매출</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-gray-400">
                <th className="text-left py-3 px-4 font-medium">월</th>
                <th className="text-right py-3 px-4 font-medium">건수</th>
                <th className="text-right py-3 px-4 font-medium">매출</th>
                <th className="text-right py-3 px-4 font-medium">환불</th>
                <th className="text-right py-3 px-4 font-medium">순매출</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row) => (
                <tr
                  key={row.month}
                  className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                >
                  <td className="py-3 px-4 text-white font-medium">{row.month}</td>
                  <td className="py-3 px-4 text-right text-gray-300">
                    {row.count + row.refundCount}건
                  </td>
                  <td className="py-3 px-4 text-right text-green-400">
                    {row.completed.toLocaleString()}원
                  </td>
                  <td className="py-3 px-4 text-right text-red-400">
                    {row.refunded > 0
                      ? `-${row.refunded.toLocaleString()}원`
                      : "0원"}
                  </td>
                  <td className="py-3 px-4 text-right text-white font-medium">
                    {row.net.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Type Breakdown */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          서비스별 매출 현황
        </h2>
        {serviceData.length === 0 ? (
          <p className="text-gray-500 text-sm">매출 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {serviceData.map((item) => (
              <div key={item.type}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300 text-sm">{item.label}</span>
                  <span className="text-white font-medium text-sm">
                    {item.amount.toLocaleString()}원
                  </span>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-3">
                  <div
                    className="bg-[#ADFF2F] h-3 rounded-full transition-all"
                    style={{
                      width: `${(item.amount / maxServiceAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
