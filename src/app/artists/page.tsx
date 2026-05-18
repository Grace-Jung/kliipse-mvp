import Link from "next/link";
import { Music, Star, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const GENRE_FILTERS = ["전체", "House", "Techno", "Hip-Hop", "EDM", "Deep House", "K-Pop"];

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  const selectedGenre = genre || "전체";

  const artists = await prisma.artist.findMany({
    where: {
      isActive: true,
      ...(selectedGenre !== "전체" ? { genres: { contains: selectedGenre } } : {}),
    },
    orderBy: { rating: "desc" },
  });

  return (
    <section className="min-h-screen bg-[#0a0a0a] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
            <span className="text-[#ADFF2F]">아티스트</span> 탐색
          </h1>
          <p className="text-[#888]">
            공간과 무드에 딱 맞는 프로페셔널 아티스트를 찾아보세요
          </p>
        </div>

        {/* Genre Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {GENRE_FILTERS.map((g) => (
            <Link
              key={g}
              href={g === "전체" ? "/artists" : `/artists?genre=${encodeURIComponent(g)}`}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedGenre === g
                  ? "bg-[#ADFF2F] text-[#0a0a0a]"
                  : "border border-[#2a2a2a] bg-[#1a1a1a] text-[#888] hover:border-[#ADFF2F]/50 hover:text-white"
              }`}
            >
              {g}
            </Link>
          ))}
        </div>

        {/* Artist Grid */}
        {artists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="mb-4 size-12 text-[#333]" />
            <p className="text-lg text-[#888]">해당 장르의 아티스트가 없습니다</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => {
              const genres: string[] = (() => {
                try {
                  return JSON.parse(artist.genres);
                } catch {
                  return [];
                }
              })();

              return (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-all hover:border-[#ADFF2F]/30 hover:shadow-[0_0_40px_rgba(173,255,47,0.05)]"
                >
                  {/* Image Placeholder */}
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111] transition-all group-hover:from-[#1a1a1a] group-hover:to-[#1a1a1a]">
                    <Music className="size-16 text-[#ADFF2F]/20 transition-colors group-hover:text-[#ADFF2F]/40" />
                  </div>

                  <div className="p-6">
                    {/* Name & Rating */}
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#ADFF2F]">
                        {artist.stageName}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-[#ADFF2F]">
                        <Star className="size-3.5 fill-current" />
                        {artist.rating.toFixed(1)}
                      </div>
                    </div>

                    {/* Career */}
                    <p className="mb-3 text-sm text-[#888]">
                      경력 {artist.careerYears}년
                    </p>

                    {/* Genres */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {genres.slice(0, 3).map((g: string) => (
                        <span
                          key={g}
                          className="rounded-full bg-[#ADFF2F]/10 px-2.5 py-0.5 text-xs font-medium text-[#ADFF2F]"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <p className="text-lg font-bold text-white">
                      {artist.basePrice.toLocaleString("ko-KR")}원~
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
