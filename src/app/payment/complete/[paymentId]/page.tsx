import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

/* ────────────────────────── Helpers ──────────────────────────────── */

const methodLabels: Record<string, string> = {
  CARD: "신용/체크카드",
  BANK_TRANSFER: "계좌이체",
  KAKAO_PAY: "카카오페이",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  COMPLETED: { label: "결제 완료", color: "text-[#ADFF2F]" },
  PENDING: { label: "처리 중", color: "text-yellow-400" },
  FAILED: { label: "결제 실패", color: "text-red-400" },
  REFUNDED: { label: "환불 완료", color: "text-blue-400" },
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

function formatDate(date: Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/* ────────────────────── Checkmark Animation ─────────────────────── */

function SuccessCheckmark() {
  return (
    <div className="mb-8 flex items-center justify-center">
      <div className="relative flex size-28 items-center justify-center">
        {/* Outer glow ring */}
        <div className="absolute inset-0 animate-ping rounded-full bg-[#ADFF2F]/20" />
        {/* Circle */}
        <div className="relative flex size-24 items-center justify-center rounded-full bg-[#ADFF2F]/10 ring-2 ring-[#ADFF2F]/30">
          {/* SVG Checkmark */}
          <svg
            className="size-12 text-[#ADFF2F]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M5 13l4 4L19 7"
              className="animate-[draw_0.5s_ease-in-out_0.3s_forwards]"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: 24,
                animation: "draw 0.5s ease-in-out 0.3s forwards",
              }}
            />
          </svg>
        </div>
      </div>
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────── Page Component ───────────────────────────── */

export default async function PaymentCompletePage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { serviceRequest: true },
  });

  if (!payment) {
    notFound();
  }

  const status = statusLabels[payment.status] || statusLabels.COMPLETED;

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-lg">
        {/* Success Header */}
        <div className="mb-10 text-center">
          <SuccessCheckmark />
          <h1 className="mb-3 text-3xl font-extrabold text-white">
            결제가 <span className="text-[#ADFF2F]">완료</span>되었습니다!
          </h1>
          <p className="text-[#888]">아래에서 결제 영수증을 확인해 주세요.</p>
        </div>

        {/* Receipt */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111]">
          <div className="border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-4">
            <h2 className="text-lg font-bold text-white">결제 영수증</h2>
          </div>

          <div className="divide-y divide-[#2a2a2a]">
            {/* Transaction ID */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[#888]">거래 번호</span>
              <span className="font-mono text-sm font-medium text-white">
                {payment.transactionId || "-"}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[#888]">결제 금액</span>
              <span className="text-xl font-bold text-[#ADFF2F]">
                {formatAmount(payment.amount)}원
              </span>
            </div>

            {/* Method */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[#888]">결제 수단</span>
              <span className="text-sm font-medium text-white">
                {methodLabels[payment.method] || payment.method}
                {payment.cardNumber && (
                  <span className="ml-2 font-mono text-[#888]">({payment.cardNumber})</span>
                )}
                {payment.bankName && (
                  <span className="ml-2 text-[#888]">({payment.bankName}은행)</span>
                )}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[#888]">결제 일시</span>
              <span className="text-sm font-medium text-white">
                {formatDate(payment.paidAt)}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[#888]">결제 상태</span>
              <span className={`text-sm font-bold ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Service Info */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-[#888]">고객명</span>
              <span className="text-sm font-medium text-white">
                {payment.serviceRequest.customerName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ADFF2F] px-6 py-3.5 font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_30px_rgba(173,255,47,0.3)]"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/quote"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] px-6 py-3.5 font-medium text-[#ccc] transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
          >
            견적 요청 내역 확인
          </Link>
        </div>
      </div>
    </section>
  );
}
