import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { serviceRequests: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalCount = users.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">회원 관리</h1>
        <span className="text-sm text-gray-400">
          총 <span className="text-[#ADFF2F] font-semibold">{totalCount}</span>명
        </span>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">등록된 회원이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400 bg-[#151515]">
                  <th className="text-left py-3 px-4 font-medium">이름</th>
                  <th className="text-left py-3 px-4 font-medium">이메일</th>
                  <th className="text-left py-3 px-4 font-medium">전화번호</th>
                  <th className="text-left py-3 px-4 font-medium">역할</th>
                  <th className="text-left py-3 px-4 font-medium">
                    견적 요청 수
                  </th>
                  <th className="text-left py-3 px-4 font-medium">가입일</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ADFF2F]/20 text-[#ADFF2F] text-xs font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {user.phone || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {user._count.serviceRequests}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("ko-KR")}
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

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: "bg-red-500/10 text-red-400 border-red-500/30",
    CUSTOMER: "bg-green-500/10 text-green-400 border-green-500/30",
    ARTIST: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    PARTNER: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };

  const labels: Record<string, string> = {
    ADMIN: "관리자",
    CUSTOMER: "고객",
    ARTIST: "아티스트",
    PARTNER: "파트너 신청중",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
        styles[role] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
      }`}
    >
      {labels[role] || role}
    </span>
  );
}
