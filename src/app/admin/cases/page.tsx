import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteButton } from "../artists/delete-button";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const cases = await prisma.successCase.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">성공 사례 관리</h1>
        <Link
          href="/admin/cases/new"
          className="px-4 py-2 bg-[#ADFF2F] text-black font-semibold rounded-lg hover:bg-[#9aec20] transition text-sm"
        >
          + 사례 추가
        </Link>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {cases.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">등록된 성공 사례가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400 bg-[#151515]">
                  <th className="text-left py-3 px-4 font-medium">제목</th>
                  <th className="text-left py-3 px-4 font-medium">서비스 유형</th>
                  <th className="text-left py-3 px-4 font-medium">설명</th>
                  <th className="text-left py-3 px-4 font-medium">결과 요약</th>
                  <th className="text-left py-3 px-4 font-medium">등록일</th>
                  <th className="text-left py-3 px-4 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                  >
                    <td className="py-3 px-4 text-white font-medium">{item.title}</td>
                    <td className="py-3 px-4 text-gray-300">{item.serviceType}</td>
                    <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                      {item.resultSummary}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/cases/new?id=${item.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          수정
                        </Link>
                        <DeleteButton id={item.id} type="cases" />
                      </div>
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
