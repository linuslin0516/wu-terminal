'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: '首頁', cmd: 'home' },
    { href: '/archive', label: '歷史', cmd: 'archive' },
    { href: '/about', label: '關於', cmd: 'about' },
  ]

  return (
    <nav className="flex flex-wrap items-center gap-4 mb-8 pb-4 border-b border-terminal-dim/30">
      <span className="text-terminal-dim text-sm">Navigation:</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm transition-all ${
            pathname === link.href
              ? 'text-terminal-fg glow'
              : 'text-terminal-dim hover:text-terminal-accent'
          }`}
        >
          <span className="text-terminal-accent">$</span> {link.cmd}
          {pathname === link.href && <span className="ml-1">*</span>}
        </Link>
      ))}
    </nav>
  )
}
