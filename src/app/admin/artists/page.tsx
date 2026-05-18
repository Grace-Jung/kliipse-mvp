import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">아티스트 관리</h1>
        <Link
          href="/admin/artists/new"
          className="px-4 py-2 bg-[#ADFF2F] text-black font-semibold rounded-lg hover:bg-[#9aec20] transition text-sm"
        >
          + 아티스트 추가
        </Link>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {artists.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">등록된 아티스트가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400 bg-[#151515]">
                  <th className="text-left py-3 px-4 font-medium">활동명</th>
                  <th className="text-left py-3 px-4 font-medium">본명</th>
                  <th className="text-left py-3 px-4 font-medium">장르</th>
                  <th className="text-left py-3 px-4 font-medium">경력</th>
                  <th className="text-left py-3 px-4 font-medium">평점</th>
                  <th className="text-left py-3 px-4 font-medium">기본 가격</th>
                  <th className="text-left py-3 px-4 font-medium">상태</th>
                  <th className="text-left py-3 px-4 font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr
                    key={artist.id}
                    className="border-b border-[#1f1f1f] hover:bg-[#222] transition"
                  >
                    <td className="py-3 px-4 text-white font-medium">{artist.stageName}</td>
                    <td className="py-3 px-4 text-gray-300">{artist.name}</td>
                    <td className="py-3 px-4 text-gray-300">{artist.genres}</td>
                    <td className="py-3 px-4 text-gray-300">{artist.careerYears}년</td>
                    <td className="py-3 px-4 text-yellow-400">{artist.rating.toFixed(1)}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {artist.basePrice.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                          artist.isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        {artist.isActive ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/artists/new?id=${artist.id}`}
                          className="text-xs text-blue-400 hover:text-blue-300 transition"
                        >
                          수정
                        </Link>
                        <DeleteButton id={artist.id} type="artists" />
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
