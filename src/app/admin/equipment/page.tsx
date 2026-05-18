import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteButton } from "../artists/delete-button";

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const equipment = await prisma.equipment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">장비 관리</h1>
        <Link
          href="/admin/equipment/new"
          className="px-4 py-2 bg-[#ADFF2F] text-black font-semibold rounded-lg hover:bg-[#9aec20] transition text-sm"
        >
          + 장비 추가
        </Link>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {equipment.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">등록된 장비가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400 bg-[#151515]">
                  <th className="text-left py-3 px-4 font-medium">장비명</th>
                  <th className="text-left py-3 px-4 font-medium">카테고리</th>
                  <th className="text-left py-3 px-4 font-medium">설명</th>
                  <th className="text-left py-3 px-4 font-medium">대여 가격</th>
                  <th className="text-left py-3 px-4 font-medium">상태</th>
                  <th className="text-left py-3 px-4 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                  >
                    <td className="py-3 px-4 text-white font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-gray-300">{item.category}</td>
                    <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {item.rentalPrice.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                          item.isAvailable
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        {item.isAvailable ? "대여가능" : "대여불가"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/equipment/new?id=${item.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          수정
                        </Link>
                        <DeleteButton id={item.id} type="equipment" />
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
