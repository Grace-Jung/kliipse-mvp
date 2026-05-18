"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { getUserFromClientCookie, type AuthUser } from "@/lib/auth";

const navItems = [
  { label: "서비스", href: "/#services" },
  { label: "아티스트 탐색", href: "/artists" },
  { label: "장비 렌탈", href: "/equipment" },
  { label: "파트너 등록", href: "/partner/apply" },
  { label: "매칭 성공 사례", href: "/#cases" },
];

export function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getUserFromClientCookie());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#ADFF2F]">
          kliipse
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-[#ADFF2F]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-3 py-2 text-sm font-medium text-white transition-colors hover:border-[#ADFF2F]"
              >
                <User className="size-4 text-[#ADFF2F]" />
                <span>{user.name}</span>
                <ChevronDown className={`size-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] py-1 shadow-xl">
                  <Link
                    href="/mypage"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-[#2a2a2a] hover:text-[#ADFF2F] transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="size-4" />
                    마이페이지
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-[#2a2a2a] hover:text-red-400 transition-colors"
                  >
                    <LogOut className="size-4" />
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-[#ADFF2F] px-4 py-2 text-sm font-semibold text-[#ADFF2F] transition-colors hover:bg-[#ADFF2F] hover:text-[#0a0a0a]"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[#ADFF2F] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#9aec20]"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white/70 hover:text-[#ADFF2F] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[#2a2a2a] bg-[#0a0a0a] md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-[#1a1a1a] hover:text-[#ADFF2F]"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/mypage"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-[#1a1a1a] hover:text-[#ADFF2F]"
                  onClick={() => setMobileOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="mt-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-center text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="mt-2 rounded-lg border border-[#ADFF2F] px-4 py-2.5 text-center text-sm font-semibold text-[#ADFF2F] transition-colors hover:bg-[#ADFF2F] hover:text-[#0a0a0a]"
                  onClick={() => setMobileOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="mt-1 rounded-lg bg-[#ADFF2F] px-4 py-2.5 text-center text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#9aec20]"
                  onClick={() => setMobileOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
