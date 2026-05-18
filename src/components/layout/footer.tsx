import Link from "next/link";

const serviceLinks = [
  { label: "DJ 섭외", href: "/quote?service=DJ_BOOKING" },
  { label: "장비 렌탈", href: "/quote?service=EQUIPMENT_RENTAL" },
  { label: "음향 시공", href: "/quote?service=SOUND_INSTALLATION" },
  { label: "견적 요청", href: "/quote" },
];

const companyLinks = [
  { label: "아티스트 탐색", href: "/artists" },
  { label: "장비 탐색", href: "/equipment" },
  { label: "매칭 성공 사례", href: "/#cases" },
  { label: "이용방법", href: "/#process" },
];

const supportLinks = [
  { label: "견적 요청", href: "/quote" },
  { label: "문의하기", href: "/quote" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-extrabold text-[#ADFF2F]">
              kliipse
            </Link>
            <p className="text-sm leading-relaxed text-[#888]">
              공간과 무드에 맞는
              <br />
              아티스트와 장비를 한 번에.
            </p>
            <div className="flex gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com/kliipse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full border border-[#2a2a2a] text-[#888] transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
                aria-label="Instagram"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com/@kliipse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full border border-[#2a2a2a] text-[#888] transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
                aria-label="YouTube"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* KakaoTalk */}
              <a
                href="https://pf.kakao.com/kliipse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-full border border-[#2a2a2a] text-[#888] transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
                aria-label="KakaoTalk"
              >
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.724 1.8 5.113 4.508 6.459-.199.742-.72 2.687-.825 3.102-.131.517.19.51.398.371.163-.109 2.601-1.768 3.655-2.488.727.106 1.477.163 2.264.163 5.523 0 10-3.463 10-7.691C22 6.463 17.523 3 12 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Service Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">서비스</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#888] transition-colors hover:text-[#ADFF2F]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">회사</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#888] transition-colors hover:text-[#ADFF2F]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">고객지원</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#888] transition-colors hover:text-[#ADFF2F]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#2a2a2a] pt-6">
          <p className="text-center text-xs text-[#888]">
            &copy; {new Date().getFullYear()} kliipse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
