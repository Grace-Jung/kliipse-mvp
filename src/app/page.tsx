import Link from "next/link";
import { Suspense } from "react";
import { Music, Speaker, Wrench, ArrowRight, CheckCircle, Star, Users, ThumbsUp, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ────────────────────────────── Hero ────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#111]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(173,255,47,0.08)_0%,_transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          공간과 무드에 맞는
          <br />
          <span className="text-[#ADFF2F]">아티스트와 장비</span>를
          <br />
          한 번에
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-[#888] sm:text-xl">
          프리미엄 DJ 섭외부터 음향 장비 렌탈, 음향 시공까지.
          <br className="hidden sm:block" />
          kliipse가 완벽한 사운드 경험을 만들어 드립니다.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ADFF2F] px-8 py-4 text-base font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_30px_rgba(173,255,47,0.3)]"
          >
            무료 견적 요청
            <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] px-8 py-4 text-base font-semibold text-white transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
          >
            아티스트 탐색
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Service Categories ────────────────────── */

const services = [
  {
    icon: Music,
    title: "DJ 섭외",
    description: "파티, 웨딩, 기업 행사 등 공간과 무드에 딱 맞는 프로페셔널 DJ를 매칭해 드립니다.",
    href: "/quote?service=DJ_BOOKING",
  },
  {
    icon: Speaker,
    title: "장비 렌탈",
    description: "스피커, DJ 세트, 조명 등 행사에 필요한 모든 음향 장비를 합리적인 가격에 렌탈하세요.",
    href: "/quote?service=EQUIPMENT_RENTAL",
  },
  {
    icon: Wrench,
    title: "음향 시공",
    description: "카페, 라운지, 클럽 등 공간 특성에 맞는 맞춤 음향 시스템을 설계하고 시공합니다.",
    href: "/quote?service=SOUND_INSTALLATION",
  },
];

function ServiceSection() {
  return (
    <section id="services" className="bg-[#0a0a0a] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            <span className="text-[#ADFF2F]">kliipse</span>의 서비스
          </h2>
          <p className="text-[#888]">어떤 서비스가 필요하신가요?</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 transition-all hover:border-[#ADFF2F]/30 hover:shadow-[0_0_40px_rgba(173,255,47,0.05)]"
            >
              <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-[#ADFF2F]/10 text-[#ADFF2F]">
                <service.icon className="size-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white group-hover:text-[#ADFF2F]">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#888]">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Matching Process ──────────────────────── */

const steps = [
  { step: "01", title: "요구사항 전달", description: "행사 유형, 날짜, 장소, 예산을 알려주세요." },
  { step: "02", title: "맞춤 매칭", description: "조건에 맞는 아티스트와 장비를 선별합니다." },
  { step: "03", title: "견적 확인", description: "상세 견적을 확인하고 최종 선택합니다." },
  { step: "04", title: "행사 진행", description: "전문 팀이 현장에서 완벽하게 진행합니다." },
];

function ProcessSection() {
  return (
    <section id="process" className="bg-[#111] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">이용 방법</h2>
          <p className="text-[#888]">간단한 4단계로 완벽한 사운드를 경험하세요</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="mb-4 text-5xl font-extrabold text-[#ADFF2F]/20">{item.step}</div>
              <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-[#888]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── Artist & Equipment Preview (Server) ──────────── */

async function ArtistEquipmentPreview() {
  const [artists, equipment] = await Promise.all([
    prisma.artist.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { rating: "desc" },
    }),
    prisma.equipment.findMany({
      where: { isAvailable: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (artists.length === 0 && equipment.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#0a0a0a] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Artists */}
        {artists.length > 0 && (
          <div className="mb-16">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                인기 <span className="text-[#ADFF2F]">아티스트</span>
              </h2>
              <Link
                href="/artists"
                className="flex items-center gap-1 text-sm font-medium text-[#ADFF2F] hover:underline"
              >
                전체 보기 <ArrowRight className="size-4" />
              </Link>
            </div>
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
                    className="block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-all hover:border-[#ADFF2F]/30"
                  >
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                      <Music className="size-16 text-[#ADFF2F]/20" />
                    </div>
                    <div className="p-6">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-lg font-bold">{artist.stageName}</h3>
                        <div className="flex items-center gap-1 text-sm text-[#ADFF2F]">
                          <Star className="size-3.5 fill-current" />
                          {artist.rating.toFixed(1)}
                        </div>
                      </div>
                      <p className="mb-3 text-sm text-[#888]">{artist.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {genres.slice(0, 3).map((genre: string) => (
                          <span
                            key={genre}
                            className="rounded-full bg-[#ADFF2F]/10 px-2.5 py-0.5 text-xs font-medium text-[#ADFF2F]"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Equipment */}
        {equipment.length > 0 && (
          <div>
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                추천 <span className="text-[#ADFF2F]">장비</span>
              </h2>
              <Link
                href="/equipment"
                className="flex items-center gap-1 text-sm font-medium text-[#ADFF2F] hover:underline"
              >
                전체 보기 <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item) => (
                <Link
                  key={item.id}
                  href={`/equipment/${item.id}`}
                  className="block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-all hover:border-[#ADFF2F]/30"
                >
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#111]">
                    <Speaker className="size-16 text-[#ADFF2F]/20" />
                  </div>
                  <div className="p-6">
                    <span className="mb-2 inline-block rounded-full bg-[#ADFF2F]/10 px-2.5 py-0.5 text-xs font-medium text-[#ADFF2F]">
                      {item.category}
                    </span>
                    <h3 className="mb-1 text-lg font-bold">{item.name}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-[#888]">{item.description}</p>
                    <p className="text-lg font-bold text-[#ADFF2F]">
                      {item.rentalPrice.toLocaleString()}원<span className="text-sm font-normal text-[#888]"> / 일</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────────────────── Success Cases (Server) ──────────────────── */

async function SuccessCasesSection() {
  const cases = await prisma.successCase.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  if (cases.length === 0) return null;

  return (
    <section id="cases" className="bg-[#111] px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            매칭 <span className="text-[#ADFF2F]">성공 사례</span>
          </h2>
          <p className="text-[#888]">kliipse와 함께한 특별한 순간들</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {cases.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 transition-all hover:border-[#ADFF2F]/30"
            >
              <span className="mb-4 inline-block rounded-full bg-[#ADFF2F]/10 px-3 py-1 text-xs font-medium text-[#ADFF2F]">
                {c.serviceType}
              </span>
              <h3 className="mb-3 text-xl font-bold">{c.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-[#888]">{c.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-[#ADFF2F]">
                <CheckCircle className="size-4" />
                {c.resultSummary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Trust Metrics ─────────────────────────── */

const metrics = [
  { icon: Users, value: "20+", label: "월 평균 매칭" },
  { icon: ThumbsUp, value: "100%", label: "고객 만족도" },
  { icon: RotateCcw, value: "100%", label: "재이용률" },
];

function TrustSection() {
  return (
    <section className="bg-[#0a0a0a] px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#ADFF2F]/10">
                <metric.icon className="size-8 text-[#ADFF2F]" />
              </div>
              <div className="mb-1 text-4xl font-extrabold text-[#ADFF2F]">{metric.value}</div>
              <div className="text-sm text-[#888]">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── Inquiry CTA ───────────────────────────── */

function InquiryCTA() {
  return (
    <section className="bg-[#111] px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          행사에 맞는 아티스트와 장비가
          <br />
          필요하신가요?
        </h2>
        <p className="mb-10 text-[#888]">
          원하는 조건을 알려주시면 최적의 매칭을 제안해 드립니다.
        </p>
        <Link
          href="/quote"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ADFF2F] px-10 py-4 text-lg font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_30px_rgba(173,255,47,0.3)]"
        >
          문의하기
          <ArrowRight className="size-5" />
        </Link>
      </div>
    </section>
  );
}

/* ────────────────────────── Page ────────────────────────────────── */

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServiceSection />
      <ProcessSection />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24 text-[#888]">
            아티스트 및 장비 정보를 불러오는 중...
          </div>
        }
      >
        <ArtistEquipmentPreview />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24 text-[#888]">
            성공 사례를 불러오는 중...
          </div>
        }
      >
        <SuccessCasesSection />
      </Suspense>
      <TrustSection />
      <InquiryCTA />
    </>
  );
}
