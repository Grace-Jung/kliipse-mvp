import Link from "next/link";
import { Speaker, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CATEGORY_FILTERS = ["전체", "스피커", "DJ 세트", "조명", "기타"];

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedCategory = category || "전체";

  const equipment = await prisma.equipment.findMany({
    where: {
      isAvailable: true,
      ...(selectedCategory !== "전체" ? { category: selectedCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="min-h-screen bg-[#0a0a0a] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
            <span className="text-[#ADFF2F]">장비</span> 렌탈
          </h1>
          <p className="text-[#888]">
            행사에 필요한 모든 음향 장비를 합리적인 가격에 렌탈하세요
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORY_FILTERS.map((c) => (
            <Link
              key={c}
              href={
                c === "전체"
                  ? "/equipment"
                  : `/equipment?category=${encodeURIComponent(c)}`
              }
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedCategory === c
                  ? "bg-[#ADFF2F] text-[#0a0a0a]"
                  : "border border-[#2a2a2a] bg-[#1a1a1a] text-[#888] hover:border-[#ADFF2F]/50 hover:text-white"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Equipment Grid */}
        {equipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="mb-4 size-12 text-[#333]" />
            <p className="text-lg text-[#888]">해당 카테고리의 장비가 없습니다</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => {
              const specs: Record<string, string> = (() => {
                try {
                  return JSON.parse(item.specs);
                } catch {
                  return {};
                }
              })();
              const specEntries = Object.entries(specs).slice(0, 2);

              return (
                <Link
                  key={item.id}
                  href={`/equipment/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-all hover:border-[#ADFF2F]/30 hover:shadow-[0_0_40px_rgba(173,255,47,0.05)]"
                >
                  {/* Image Placeholder */}
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111] transition-all group-hover:from-[#1a1a1a] group-hover:to-[#1a1a1a]">
                    <Speaker className="size-16 text-[#ADFF2F]/20 transition-colors group-hover:text-[#ADFF2F]/40" />
                  </div>

                  <div className="p-6">
                    {/* Category Badge */}
                    <span className="mb-3 inline-block rounded-full bg-[#ADFF2F]/10 px-2.5 py-0.5 text-xs font-medium text-[#ADFF2F]">
                      {item.category}
                    </span>

                    {/* Name */}
                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-[#ADFF2F]">
                      {item.name}
                    </h3>

                    {/* Specs Preview */}
                    {specEntries.length > 0 && (
                      <div className="mb-4 space-y-1">
                        {specEntries.map(([key, value]) => (
                          <p key={key} className="text-xs text-[#888]">
                            <span className="text-[#666]">{key}:</span> {value}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <p className="text-lg font-bold text-[#ADFF2F]">
                      {item.rentalPrice.toLocaleString("ko-KR")}원~
                      <span className="text-sm font-normal text-[#888]"> / 일</span>
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
