"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "대시보드", href: "/admin", icon: "📊" },
  { label: "견적 요청", href: "/admin/requests", icon: "📋" },
  { label: "아티스트 관리", href: "/admin/artists", icon: "🎤" },
  { label: "장비 관리", href: "/admin/equipment", icon: "🔊" },
  { label: "성공 사례", href: "/admin/cases", icon: "🏆" },
  { label: "결제 관리", href: "/admin/payments", icon: "💳" },
  { label: "회원 관리", href: "/admin/users", icon: "👥" },
  { label: "파트너 신청", href: "/admin/partners", icon: "🤝" },
  { label: "매출 관리", href: "/admin/revenue", icon: "💰" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-[#222] flex flex-col fixed h-full">
        <div className="px-6 py-5 border-b border-[#222]">
          <Link href="/admin" className="text-xl font-bold text-white">
            kliipse <span className="text-[#ADFF2F]">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-[#ADFF2F]/10 text-[#ADFF2F]"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#222]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition w-full"
          >
            <span className="text-base">🚪</span>
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
