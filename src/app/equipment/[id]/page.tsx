import Link from "next/link";
import { notFound } from "next/navigation";
import { Speaker, ArrowLeft, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.equipment.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!item) notFound();

  const specs: Record<string, string> = (() => {
    try {
      return JSON.parse(item.specs);
    } catch {
      return {};
    }
  })();

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;
    return (
      <span className="text-yellow-400">
        {"★".repeat(full)}
        {hasHalf && "★"}
        {"☆".repeat(5 - full - (hasHalf ? 1 : 0))}
      </span>
    );
  };

  return (
    <section className="min-h-screen bg-[#0a0a0a] px-4 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          href="/equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#888] transition-colors hover:text-[#ADFF2F]"
        >
          <ArrowLeft className="size-4" />
          장비 목록으로
        </Link>

        {/* Detail Section */}
        <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]">
          {/* Image Placeholder */}
          <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111] sm:h-80">
            <Speaker className="size-24 text-[#ADFF2F]/20" />
          </div>

          <div className="p-8 sm:p-10">
            {/* Category Badge */}
            <span className="mb-4 inline-block rounded-full bg-[#ADFF2F]/10 px-3 py-1 text-sm font-medium text-[#ADFF2F]">
              {item.category}
            </span>

            {/* Name */}
            <h1 className="mb-4 text-3xl font-extrabold sm:text-4xl">
              {item.name}
            </h1>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-bold text-white">설명</h2>
              <p className="whitespace-pre-line leading-relaxed text-[#888]">
                {item.description}
              </p>
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-lg font-bold text-white">상세 사양</h2>
                <div className="overflow-hidden rounded-xl border border-[#2a2a2a]">
                  {Object.entries(specs).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-5 py-3 text-sm ${
                        idx % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#1a1a1a]"
                      }`}
                    >
                      <span className="font-medium text-[#888]">{key}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price & CTA */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-6 sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 text-sm text-[#888]">렌탈 가격</p>
                <p className="text-2xl font-extrabold text-[#ADFF2F]">
                  {item.rentalPrice.toLocaleString("ko-KR")}원~
                  <span className="ml-1 text-base font-normal text-[#888]">
                    / 일
                  </span>
                </p>
              </div>
              <Link
                href={`/quote?equipmentId=${item.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ADFF2F] px-8 py-4 text-base font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_30px_rgba(173,255,47,0.3)]"
              >
                이 장비로 견적 요청
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="mb-6 text-2xl font-bold">
            리뷰 <span className="text-[#888]">({item.reviews.length})</span>
          </h2>

          {item.reviews.length === 0 ? (
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-10 text-center">
              <p className="text-[#888]">아직 리뷰가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {item.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {review.authorName}
                    </span>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-[#888]">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#888]">
                    {review.content}
                  </p>
                  <p className="mt-3 text-xs text-[#555]">
                    {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
