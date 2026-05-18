import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PartnerActionButtons } from "./action-buttons";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const applications = await prisma.partnerApplication.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">파트너 신청 관리</h1>
        <div className="flex gap-3 text-sm">
          <span className="text-gray-400">
            전체 <span className="font-semibold text-white">{applications.length}</span>건
          </span>
          {pendingCount > 0 && (
            <span className="text-yellow-400">
              대기 <span className="font-semibold">{pendingCount}</span>건
            </span>
          )}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-12 text-center text-gray-500">
          파트너 신청 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            let genres: string[] = [];
            try { genres = JSON.parse(app.genres); } catch { /* ignore */ }

            return (
              <div key={app.id} className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#ADFF2F]/20 text-lg font-bold text-[#ADFF2F]">
                      {app.stageName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{app.stageName}</h3>
                      <p className="text-sm text-gray-400">{app.user.name} · {app.user.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg bg-[#0a0a0a] p-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-gray-500">경력</span>
                    <p className="font-medium text-white">{app.careerYears}년</p>
                  </div>
                  <div>
                    <span className="text-gray-500">지역</span>
                    <p className="font-medium text-white">{app.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">전화번호</span>
                    <p className="font-medium text-white">{app.user.phone || "-"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">신청일</span>
                    <p className="font-medium text-white">{new Date(app.createdAt).toLocaleDateString("ko-KR")}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm text-gray-500">장르</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {genres.map((g) => (
                      <span key={g} className="rounded-full bg-[#ADFF2F]/10 px-2.5 py-0.5 text-xs font-medium text-[#ADFF2F]">{g}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-sm text-gray-500">자기소개</span>
                  <p className="mt-1 text-sm leading-relaxed text-gray-300">{app.bio}</p>
                </div>

                {app.portfolioUrl && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">포트폴리오</span>
                    <p className="mt-1">
                      <Link href={app.portfolioUrl} target="_blank" className="text-sm text-[#ADFF2F] hover:underline">
                        {app.portfolioUrl}
                      </Link>
                    </p>
                  </div>
                )}

                {app.adminMemo && (
                  <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
                    <span className="text-xs text-yellow-400">관리자 메모</span>
                    <p className="mt-1 text-sm text-gray-300">{app.adminMemo}</p>
                  </div>
                )}

                {app.status === "PENDING" && (
                  <PartnerActionButtons applicationId={app.id} userId={app.userId} stageName={app.stageName} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; style: string }> = {
    PENDING: { label: "검토 대기", style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
    APPROVED: { label: "승인", style: "bg-green-500/10 text-green-400 border-green-500/30" },
    REJECTED: { label: "거절", style: "bg-red-500/10 text-red-400 border-red-500/30" },
  };
  const c = config[status] || { label: status, style: "bg-gray-500/10 text-gray-400 border-gray-500/30" };
  return <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${c.style}`}>{c.label}</span>;
}
