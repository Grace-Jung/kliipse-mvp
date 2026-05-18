"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromClientCookie } from "@/lib/auth";
import Link from "next/link";

const genreOptions = ["House", "Deep House", "Techno", "Hip-Hop", "R&B", "EDM", "K-Pop", "Top 40", "Progressive", "Lounge", "Future Bass"];

export default function PartnerApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [stageName, setStageName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [careerYears, setCareerYears] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  useEffect(() => {
    const u = getUserFromClientCookie();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!stageName.trim()) return setError("활동명을 입력해 주세요.");
    if (selectedGenres.length === 0) return setError("장르를 1개 이상 선택해 주세요.");
    if (!careerYears || Number(careerYears) < 0) return setError("경력을 입력해 주세요.");
    if (!location.trim()) return setError("활동 지역을 입력해 주세요.");
    if (!bio.trim()) return setError("자기소개를 입력해 주세요.");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/partner/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          stageName: stageName.trim(),
          genres: selectedGenres,
          careerYears: Number(careerYears),
          location: location.trim(),
          bio: bio.trim(),
          portfolioUrl: portfolioUrl.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "신청 중 오류가 발생했습니다.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#ADFF2F]/10 text-4xl">🎉</div>
          </div>
          <h2 className="mb-3 text-2xl font-bold">파트너 신청이 완료되었습니다!</h2>
          <p className="mb-8 text-[#888]">관리자 검토 후 승인 결과를 안내드리겠습니다.</p>
          <Link href="/" className="inline-flex rounded-xl border border-[#2a2a2a] px-8 py-3 font-medium text-[#ccc] hover:border-[#ADFF2F] hover:text-[#ADFF2F]">
            홈으로 돌아가기
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">파트너 등록 신청</h1>
          <p className="text-[#888]">kliipse 파트너 아티스트로 활동하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#ccc]">활동명 (Stage Name) *</label>
            <input type="text" value={stageName} onChange={(e) => setStageName(e.target.value)} placeholder="예: DJ SEOUL"
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white placeholder-[#555] focus:border-[#ADFF2F] focus:outline-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#ccc]">장르 * (복수 선택 가능)</label>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((genre) => (
                <button key={genre} type="button" onClick={() => toggleGenre(genre)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium border transition ${
                    selectedGenres.includes(genre)
                      ? "bg-[#ADFF2F]/20 border-[#ADFF2F] text-[#ADFF2F]"
                      : "border-[#333] text-[#888] hover:border-[#555]"
                  }`}>
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#ccc]">경력 (년) *</label>
              <input type="number" min="0" value={careerYears} onChange={(e) => setCareerYears(e.target.value)} placeholder="5"
                className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white placeholder-[#555] focus:border-[#ADFF2F] focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#ccc]">활동 지역 *</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="서울"
                className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white placeholder-[#555] focus:border-[#ADFF2F] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#ccc]">자기소개 *</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="경력, 전문 분야, 활동 이력 등을 자유롭게 작성해 주세요."
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white placeholder-[#555] focus:border-[#ADFF2F] focus:outline-none resize-none" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#ccc]">포트폴리오 URL (선택)</label>
            <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://soundcloud.com/..."
              className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-white placeholder-[#555] focus:border-[#ADFF2F] focus:outline-none" />
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full rounded-xl bg-[#ADFF2F] py-4 font-bold text-[#0a0a0a] transition hover:bg-[#c4ff5a] disabled:opacity-50">
            {isSubmitting ? "신청 중..." : "파트너 신청하기"}
          </button>
        </form>
      </div>
    </section>
  );
}
