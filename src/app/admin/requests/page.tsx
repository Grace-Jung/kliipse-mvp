import { prisma } from "@/lib/prisma";
import { StatusUpdater } from "./status-updater";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serviceTypeLabels: Record<string, string> = {
    DJ_BOOKING: "DJ 섭외",
    EQUIPMENT_RENTAL: "장비 대여",
    SOUND_INSTALLATION: "음향 시공",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">견적 요청 관리</h1>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {requests.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">견적 요청이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400 bg-[#151515]">
                  <th className="text-left py-3 px-4 font-medium">고객명</th>
                  <th className="text-left py-3 px-4 font-medium">연락처</th>
                  <th className="text-left py-3 px-4 font-medium">서비스 유형</th>
                  <th className="text-left py-3 px-4 font-medium">행사일</th>
                  <th className="text-left py-3 px-4 font-medium">행사 장소</th>
                  <th className="text-left py-3 px-4 font-medium">예산</th>
                  <th className="text-left py-3 px-4 font-medium">상태</th>
                  <th className="text-left py-3 px-4 font-medium">요청일</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                  >
                    <td className="py-3 px-4 text-white font-medium">{req.customerName}</td>
                    <td className="py-3 px-4 text-gray-300">
                      <div>{req.phone}</div>
                      <div className="text-xs text-gray-500">{req.email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {serviceTypeLabels[req.serviceType] || req.serviceType}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{req.eventDate}</td>
                    <td className="py-3 px-4 text-gray-300">{req.eventLocation}</td>
                    <td className="py-3 px-4 text-gray-300">{req.budget}</td>
                    <td className="py-3 px-4">
                      <StatusUpdater id={req.id} currentStatus={req.status} />
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(req.createdAt).toLocaleDateString("ko-KR")}
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
